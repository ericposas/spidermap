import * as d3 from 'd3'
import './generate-map.scss'
import url from '../../url'
import { getUser } from '../../sessionStore'
import { withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import React, { useState, useEffect, useRef, createRef, Fragment } from 'react'
import UserLeftSidePanel from '../Views/UserLeftSidePanel'
import DownloadImagePanel from '../Views/DownloadAndSavePanel'
import { RERENDER_HACK } from '../../constants/constants'
import {
  SET_LABEL_POSITION_POINTMAP, SET_LABEL_DISPLAY_TYPE_POINTMAP,
  SET_ALL_LABEL_POSITIONS_POINTMAP, SET_ALL_LABEL_DISPLAY_TYPES_POINTMAP,
} from '../../constants/pointmap'
import ChangeAllLabelsMenu from '../Menus/ChangeAllLabelsMenu'
import MapContextMenu from '../Menus/MapContextMenu'
import mapSettings from '../../mapSettings.config'
import { CSSTransition } from 'react-transition-group'

const GeneratePointmap = ({ ...props }) => {

  let {
    svgBgColor, svgMargin,
    originDotSize, originDotColor, originCircleColor,
    originCircleSize, originLabelFontSize,
    destinationDotColor, destinationLabelFontSize, destinationDotSize,
    pathStrokeColor, pathStrokeThickness
  } = mapSettings
  let linearScaleX, linearScaleY
  let lats = [], longs = []
  let pathCount = -1,
      labelCount = -1,
      whiteBoxUnderLabelCount = -1
  let labelAdjustX = 2,
      labelAdjustY = 2

  const dispatch = useDispatch()

  const origins = useSelector(state => state.selectedOriginsPointmap)

  const destinations = useSelector(state => state.selectedDestinationsPointmap)

  const downloadingPDF = useSelector(state => state.downloadPDFStatus)

  const displayMapBG = useSelector(state => state.displayMapBG)

  let destArr = []

  Object.keys(destinations).forEach(origin => destArr = destArr.concat(destinations[origin]))

  const pathsRef = useRef(destArr.map(() => createRef()))

  const labelsRef = origins ? useRef(origins.concat(destArr).map(() => createRef())) : null

  const whiteBoxUnderLabelsRef = origins ? useRef(origins.concat(destArr).map(() => createRef())) : null

  const [listedLegalLines, setListedLegalLines] = useState([])

  const [showContextMenu, setShowContextMenu] = useState(false)

  const [contextMenuPosition, setContextMenuPosition] = useState({})

  const [contextMenuProps, setContextMenuProps] = useState({})

  const [showChangeAllLabelsMenu, setShowChangeAllLabelsMenu] = useState(false)

  const labelPositions = useSelector(state => state.pointmap_labelPositions)

  const labelDisplayTypes = useSelector(state => state.pointmap_labelDisplayTypes)

  useEffect(() => {
    if (origins == null) props.history.push('/pointmap')
    else {
      let legal = []
      Object.keys(destinations).forEach((arr, i) => {
        legal = legal.concat(destinations[arr].map(item => { if (item && item.legal) return item.legal }))
      })
      legal = legal.concat(origins.map(item => { if (item && item.legal) return item.legal }))
      legal = legal.filter((item, i) => i == legal.indexOf(item))
      setListedLegalLines(legal)
      Object.keys(destinations).forEach(arr => {
          destinations[arr].forEach(loc => {
            if (!labelPositions || !labelPositions[loc.code] || !labelPositions[loc.code].position) {
              dispatch({ type: SET_LABEL_POSITION_POINTMAP, which: loc.code, position: 'right' })
            }
            if (labelDisplayTypes && (!labelDisplayTypes[loc.code] || !labelDisplayTypes[loc.code].displayType)) {
              dispatch({ type: SET_LABEL_DISPLAY_TYPE_POINTMAP, which: loc.code, position: 'city-code' })
            }
          })
        })
      origins.forEach(loc => {
        if (!labelPositions || !labelPositions[loc.code] || !labelPositions[loc.code].position) {
          dispatch({ type: SET_LABEL_POSITION_POINTMAP, which: loc.code, position: 'right' })
        }
        if (labelDisplayTypes && (!labelDisplayTypes[loc.code] || !labelDisplayTypes[loc.code].displayType)) {
          dispatch({ type: SET_LABEL_DISPLAY_TYPE_POINTMAP, which: loc.code, position: 'city-code' })
        }
      })
      // hack to re-render svg data
      dispatch({ type: RERENDER_HACK, payload: true })
      setTimeout(() => dispatch({ type: RERENDER_HACK, payload: false }), 5)
    }
  }, [])

  const processCodes = () => {
    let _destinations = []
    Object.keys(destinations).forEach(origin => {
      _destinations = _destinations.concat(destinations[origin])
    })
    let locations = origins.concat(_destinations)
    let codes = locations.map(loc => loc.code)
    return codes
  }

  const changeAllLabelPositions = e => {
    let val = e.target.value
    let obj = {}
    let codes = processCodes()
    codes.forEach(code => obj[code] = { position: val })
    dispatch({ type: SET_ALL_LABEL_POSITIONS_POINTMAP, payload: obj })
  }

  const changeAllLabelDisplayTypes = e => {
    let val = e.target.value
    let obj = {}
    let codes = processCodes()
    codes.forEach(code => obj[code] = { displayType: val })
    dispatch({ type: SET_ALL_LABEL_DISPLAY_TYPES_POINTMAP, payload: obj })
    setShowContextMenu(true)
    setTimeout(() => setShowContextMenu(false), 5)
  }

  const getX = long => {
    if (!longs.includes(long)) {
      longs = origins.map(ap => ap.longitude)
      Object.keys(destinations).forEach(origin => {
        let arr = destinations[origin].map(ap => ap.longitude)
        longs = longs.concat(arr)
      })
      longs.sort((a, b) => a - b)
    }
    linearScaleX = d3.scaleLinear()
                     .domain([longs[0], longs[longs.length-1]])
                     .range([svgMargin, (innerHeight * 1.15) - svgMargin])

    return linearScaleX(long)
  }

  const getY = lat => {
    if (!lats.includes(lat)) {
      lats = origins.map(ap => ap.latitude)
      Object.keys(destinations).forEach(origin => {
        let arr = destinations[origin].map(ap => ap.latitude)
        lats = lats.concat(arr)
      })
      lats.sort((a, b) => b - a)
    }
    linearScaleY = d3.scaleLinear()
                     .domain([lats[0], lats[lats.length-1]])
                     .range([svgMargin, innerHeight - svgMargin])

    return linearScaleY(lat)
  }

  const calcPath = (originObj, origin, ap, i) => {
    let cp1 = {}, cp2 = {}
    let startX, endX, distanceBetweenX
    let startY, endY, distanceBetweenY
    let bendX = 20
    let bendY = 40
    let cpStartThreshX = .25, cpEndThreshX = .75
    let cpStartThreshY = .25, cpEndThreshY = .75

    startX = getX(ap.longitude)
    endX = getX(originObj[origin].longitude)
    distanceBetweenX = endX - startX
    cp1.x = startX + (distanceBetweenX * cpStartThreshX)
    cp2.x = startX + (distanceBetweenX * cpEndThreshX)
    if (startX > endX) { cp1.x += bendX; cp2.x += bendX }
    else { cp1.x -= bendX; cp2.x -= bendX }

    startY = getY(ap.latitude)
    endY = getY(originObj[origin].latitude)
    distanceBetweenY = endY - startY
    cp1.y = startY + (distanceBetweenY * cpStartThreshY) - bendY
    cp2.y = startY + (distanceBetweenY * cpEndThreshY) - bendY

    // debug circles
    // <circle fill='#0000ff' r='2' cx={cp1.x} cy={cp1.y}></circle>
    // <circle fill='#e100ff' r='2' cx={cp2.x} cy={cp2.y}></circle>
    pathCount++

    return (
      <g>
        <path id={`${originObj[origin].code}-to-${ap.code}-path`} ref={ pathsRef.current[pathCount] }
          d={
              `M ${startX},${startY}
               C ${cp1.x},${cp1.y}
                 ${cp2.x},${cp2.y}
                 ${endX},${endY}`
            }
          strokeWidth={pathStrokeThickness}
          stroke={pathStrokeColor}
          fill='none'></path>
      </g>
    )

  }

  return (<>
    { downloadingPDF ? <div className='white-backing'></div> : null }
    <div className='row'>
      <UserLeftSidePanel/>
      <DownloadImagePanel type='pointmap' label='Point-to-Point Map'/>
      <div
        id='map-content'
        className='col-med pdf-content'
        style={{
          height:'100vh',
          position: 'relative',
          backgroundColor: '#fff',
          transform: downloadingPDF ? `scale(${550/innerHeight})` : '',
        }}>
        <ChangeAllLabelsMenu
          showChangeAllLabelsMenu={showChangeAllLabelsMenu}
          setShowChangeAllLabelsMenu={setShowChangeAllLabelsMenu}
          changeAllLabelPositions={changeAllLabelPositions}
          changeAllLabelDisplayTypes={changeAllLabelDisplayTypes}/>
        <svg
          className='svg-map-area'
          width={ (innerHeight * 1.25) }
          height={ innerHeight }
          style={{
            backgroundColor: displayMapBG ? svgBgColor : 'rgba(0, 0, 0, 0)',
            boxShadow: downloadingPDF ? '' : 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
          }}>
          <rect
            onClick={() => {
              setShowContextMenu(false)
              setShowChangeAllLabelsMenu(false)
            }}
            width={innerWidth}
            height={innerHeight}
            fill='rgba(0,0,0,0)'
            opacity='0'></rect>
          {
            destinations
            ?
              Object.keys(destinations).map(origin => {
                  let originObj = {}
                  let originCodes = origins.map(o => o.code)
                  originCodes.forEach((code, i) => originObj[code] = origins[i])
                  return destinations[origin].map((ap, i) => <Fragment key={'path'+i}>{calcPath(originObj, origin, ap, i)}</Fragment>)
              })
            : null
          }
          {
            destinations
            ?
              Object.keys(destinations).map(origin => {

                  let originObj = {}
                  let originCodes = origins.map(o => o.code)
                  originCodes.forEach((code, i) => originObj[code] = origins[i])

                  return destinations[origin].map((ap, i) => (
                    <Fragment key={ap.code}>
                      <g>
                      <circle
                        style={{
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setContextMenuProps({
                            title: ap.code
                          })
                          setContextMenuPosition({ x: getX(ap.longitude) + 20, y: getY(ap.latitude) - 100 })
                          setShowContextMenu(true)
                        }}
                        r={destinationDotSize}
                        cx={ getX(ap.longitude) }
                        cy={ getY(ap.latitude) }
                        fill={destinationDotColor}></circle>
                      <text
                        id={`destination-${ap.code}-label`}
                        ref={labelsRef.current[labelCount++]}
                        x={
                            getX(ap.longitude) + (
                              labelPositions && labelPositions[ap.code] && document.getElementById(`destination-${ap.code}-label`)
                              ?
                                labelPositions[ap.code].position == 'right'
                                ? 10
                                :
                                  labelPositions[ap.code].position == 'left'
                                  ? -(document.getElementById(`destination-${ap.code}-label`).getBBox().width + 10)
                                  :
                                    labelPositions[ap.code].position == 'bottom'
                                    ? -(document.getElementById(`destination-${ap.code}-label`).getBBox().width * .5)
                                    :
                                      labelPositions[ap.code].position == 'top'
                                      ? -(document.getElementById(`destination-${ap.code}-label`).getBBox().width * .5)
                                      : 0

                              : 10
                            )
                          }
                        y={
                          getY(ap.latitude) + (
                            labelPositions && labelPositions[ap.code] && document.getElementById(`destination-${ap.code}-label`)
                            ?
                              labelPositions[ap.code].position == 'bottom'
                              ? (document.getElementById(`destination-${ap.code}-label`).getBBox().height)
                              :
                                labelPositions[ap.code].position == 'top'
                                ? -(document.getElementById(`destination-${ap.code}-label`).getBBox().height * .5)
                                : (document.getElementById(`destination-${ap.code}-label`).getBBox().height * .25)
                            : 0
                          )
                        }
                        style={{
                          textAlign: 'center',
                          opacity:
                            document.getElementById(`origin-${ap.code}-label`)
                            ? 0
                            : 1
                        }}
                        fontFamily='AmericanSans'
                        fontSize={
                          destinations.length > 50
                          ? '.5rem'
                          :
                            destinations.length > 100
                            ? '.35rem'
                            :
                              '.75rem'
                        }>
                          {
                            labelDisplayTypes && labelDisplayTypes[ap.code]
                            ?
                              labelDisplayTypes[ap.code].displayType == 'code'
                              ? ap.code
                              :
                                labelDisplayTypes[ap.code].displayType == 'city'
                                ? ap.city
                                :
                                  labelDisplayTypes[ap.code].displayType == 'region'
                                  ? ap.region
                                  :
                                    labelDisplayTypes[ap.code].displayType == 'airport'
                                    ? `${ap.fullname}`
                                    :
                                      labelDisplayTypes[ap.code].displayType == 'city-and-code'
                                      ?
                                        `${ap.city},
                                         ${ap.code}`
                                      :
                                        `${ap.city},
                                         ${ap.code}`
                            : `${ap.city},
                               ${ap.code}`
                          }
                      </text>
                      <rect
                        id={`destination-${ap.code}-white-box-under-label`}
                        ref={whiteBoxUnderLabelsRef.current[whiteBoxUnderLabelCount++]}
                        onClick={() => {
                          setContextMenuProps({
                            title: ap.code
                          })
                          setContextMenuPosition({ x: getX(ap.longitude) + 20, y: getY(ap.latitude) - 100 })
                          setShowContextMenu(true)
                        }}
                        style={{
                          cursor: 'pointer',
                          opacity:
                            document.getElementById(`origin-${ap.code}-label`)
                            ? 0
                            : 1
                        }}
                        x={
                            getX(ap.longitude) + (
                              labelPositions && labelPositions[ap.code] && document.getElementById(`destination-${ap.code}-label`)
                              ?
                                labelPositions[ap.code].position == 'right'
                                ? 10
                                :
                                  labelPositions[ap.code].position == 'left'
                                  ? -(document.getElementById(`destination-${ap.code}-label`).getBBox().width + 10)
                                  :
                                    labelPositions[ap.code].position == 'bottom'
                                    ? -(document.getElementById(`destination-${ap.code}-label`).getBBox().width * .5)
                                    :
                                      labelPositions[ap.code].position == 'top'
                                      ? -(document.getElementById(`destination-${ap.code}-label`).getBBox().width * .5)
                                      : 0

                              : 10
                            )
                          }
                        y={
                          getY(ap.latitude) + (
                            labelPositions && labelPositions[ap.code] && document.getElementById(`destination-${ap.code}-label`)
                            ?
                              labelPositions[ap.code].position == 'bottom'
                              ? (document.getElementById(`destination-${ap.code}-label`).getBBox().height * .2)
                              :
                                labelPositions[ap.code].position == 'top'
                                ? -(document.getElementById(`destination-${ap.code}-label`).getBBox().height * 1.25)
                                : -(document.getElementById(`destination-${ap.code}-label`).getBBox().height * .5)
                            : 0
                          )
                        }
                        width={
                          document.getElementById(`destination-${ap.code}-label`) && document.getElementById(`destination-${ap.code}-label`).getBBox
                          ? document.getElementById(`destination-${ap.code}-label`).getBBox().width + 5
                          : 100
                        }
                        height={
                          document.getElementById(`destination-${ap.code}-label`) && document.getElementById(`destination-${ap.code}-label`).getBBox
                          ? document.getElementById(`destination-${ap.code}-label`).getBBox().height
                          : 12
                        }
                        fill={'#fff'}>
                        </rect>
                        <text
                          id={`destination-${ap.code}-label-double`}
                          onClick={() => {
                            setContextMenuProps({
                              title: ap.code
                            })
                            setContextMenuPosition({ x: getX(ap.longitude) + 20, y: getY(ap.latitude) - 100 })
                            setShowContextMenu(true)
                          }}
                          x={
                              getX(ap.longitude) + (
                                labelPositions && labelPositions[ap.code] && document.getElementById(`destination-${ap.code}-label`)
                                ?
                                  labelPositions[ap.code].position == 'right'
                                  ? 10
                                  :
                                    labelPositions[ap.code].position == 'left'
                                    ? -(document.getElementById(`destination-${ap.code}-label`).getBBox().width + 10)
                                    :
                                      labelPositions[ap.code].position == 'bottom'
                                      ? -(document.getElementById(`destination-${ap.code}-label`).getBBox().width * .5)
                                      :
                                        labelPositions[ap.code].position == 'top'
                                        ? -(document.getElementById(`destination-${ap.code}-label`).getBBox().width * .5)
                                        : 0

                                : 10
                              )
                            }
                          y={
                            getY(ap.latitude) + (
                              labelPositions && labelPositions[ap.code] && document.getElementById(`destination-${ap.code}-label`)
                              ?
                                labelPositions[ap.code].position == 'bottom'
                                ? (document.getElementById(`destination-${ap.code}-label`).getBBox().height)
                                :
                                  labelPositions[ap.code].position == 'top'
                                  ? -(document.getElementById(`destination-${ap.code}-label`).getBBox().height * .5)
                                  : (document.getElementById(`destination-${ap.code}-label`).getBBox().height * .25)
                              : 0
                            )
                          }
                          style={{
                            textAlign: 'center',
                            cursor: 'pointer',
                            opacity:
                              document.getElementById(`origin-${ap.code}-label`)
                              ? 0
                              : 1
                          }}
                          fontFamily='AmericanSans'
                          fontSize={
                            destinations.length > 50
                            ? '.5rem'
                            :
                              destinations.length > 100
                              ? '.35rem'
                              :
                                '.75rem'
                          }>
                            {
                              labelDisplayTypes && labelDisplayTypes[ap.code]
                              ?
                                labelDisplayTypes[ap.code].displayType == 'code'
                                ? ap.code
                                :
                                  labelDisplayTypes[ap.code].displayType == 'city'
                                  ? ap.city
                                  :
                                    labelDisplayTypes[ap.code].displayType == 'region'
                                    ? ap.region
                                    :
                                      labelDisplayTypes[ap.code].displayType == 'airport'
                                      ? `${ap.fullname}`
                                      :
                                        labelDisplayTypes[ap.code].displayType == 'city-and-code'
                                        ?
                                          `${ap.city},
                                           ${ap.code}`
                                        :
                                          `${ap.city},
                                           ${ap.code}`
                              : `${ap.city},
                                 ${ap.code}`
                            }
                        </text>
                      </g>
                    </Fragment>
                ))
              })
            : null
          }
          {
            origins
            ?
              origins.map(ap => (
                <Fragment key={ap.code}>
                  <g>
                  <text
                    id={`origin-${ap.code}-label`}
                    ref={labelsRef.current[labelCount++]}
                    x={
                        getX(ap.longitude) + (
                          labelPositions && labelPositions[ap.code] && document.getElementById(`origin-${ap.code}-label`)
                          ?
                            labelPositions[ap.code].position == 'right'
                            ? 10
                            :
                              labelPositions[ap.code].position == 'left'
                              ? -(document.getElementById(`origin-${ap.code}-label`).getBBox().width + 10)
                              :
                                labelPositions[ap.code].position == 'bottom'
                                ? -(document.getElementById(`origin-${ap.code}-label`).getBBox().width * .5)
                                :
                                  labelPositions[ap.code].position == 'top'
                                  ? -(document.getElementById(`origin-${ap.code}-label`).getBBox().width * .5)
                                  : 0

                          : 10
                        )
                      }
                    y={
                      getY(ap.latitude) + (
                        labelPositions && labelPositions[ap.code] && document.getElementById(`origin-${ap.code}-label`)
                        ?
                          labelPositions[ap.code].position == 'bottom'
                          ? (document.getElementById(`origin-${ap.code}-label`).getBBox().height)
                          :
                            labelPositions[ap.code].position == 'top'
                            ? -(document.getElementById(`origin-${ap.code}-label`).getBBox().height * .5)
                            : (document.getElementById(`origin-${ap.code}-label`).getBBox().height * .25)
                        : 0
                      )
                    }
                    style={{
                      textAlign: 'center',
                      fontSize: originLabelFontSize,
                      fontWeight: 'bold'
                    }}
                    fontFamily='AmericanSans'
                    fontSize={originLabelFontSize}>
                      {
                        labelDisplayTypes && labelDisplayTypes[ap.code]
                        ?
                          labelDisplayTypes[ap.code].displayType == 'code'
                          ? ap.code
                          :
                            labelDisplayTypes[ap.code].displayType == 'city'
                            ? ap.city
                            :
                              labelDisplayTypes[ap.code].displayType == 'region'
                              ? ap.region
                              :
                                labelDisplayTypes[ap.code].displayType == 'airport'
                                ? `${ap.fullname}`
                                :
                                  labelDisplayTypes[ap.code].displayType == 'city-and-code'
                                  ?
                                    `${ap.city},
                                     ${ap.code}`
                                  :
                                    `${ap.city},
                                     ${ap.code}`
                        : `${ap.city},
                           ${ap.code}`
                      }
                  </text>
                  <rect
                    id={`origin-${ap.code}-white-box-under-label`}
                    ref={whiteBoxUnderLabelsRef.current[whiteBoxUnderLabelCount++]}
                    onClick={() => {
                      setContextMenuProps({
                        title: ap.code
                      })
                      setContextMenuPosition({ x: getX(ap.longitude) + 20, y: getY(ap.latitude) - 100 })
                      setShowContextMenu(true)
                    }}
                    style={{ cursor: 'pointer' }}
                    x={
                        getX(ap.longitude) + (
                          labelPositions && labelPositions[ap.code] && document.getElementById(`origin-${ap.code}-label`)
                          ?
                            labelPositions[ap.code].position == 'right'
                            ? 10
                            :
                              labelPositions[ap.code].position == 'left'
                              ? -(document.getElementById(`origin-${ap.code}-label`).getBBox().width + 10)
                              :
                                labelPositions[ap.code].position == 'bottom'
                                ? -(document.getElementById(`origin-${ap.code}-label`).getBBox().width * .5)
                                :
                                  labelPositions[ap.code].position == 'top'
                                  ? -(document.getElementById(`origin-${ap.code}-label`).getBBox().width * .5)
                                  : 0

                          : 10
                        )
                      }
                    y={
                      getY(ap.latitude) + (
                        labelPositions && labelPositions[ap.code] && document.getElementById(`origin-${ap.code}-label`)
                        ?
                          labelPositions[ap.code].position == 'bottom'
                          ? (document.getElementById(`origin-${ap.code}-label`).getBBox().height * .2)
                          :
                            labelPositions[ap.code].position == 'top'
                            ? -(document.getElementById(`origin-${ap.code}-label`).getBBox().height * 1.25)
                            : -(document.getElementById(`origin-${ap.code}-label`).getBBox().height * .5)
                        : 0
                      )
                    }
                    width={
                      document.getElementById(`origin-${ap.code}-label`) && document.getElementById(`origin-${ap.code}-label`).getBBox
                      ? document.getElementById(`origin-${ap.code}-label`).getBBox().width + 5
                      : 100
                    }
                    height={
                      document.getElementById(`origin-${ap.code}-label`) && document.getElementById(`origin-${ap.code}-label`).getBBox
                      ? document.getElementById(`origin-${ap.code}-label`).getBBox().height
                      : 12
                    }
                    fill={'#fff'}>
                    </rect>
                    <text
                      id={`origin-${ap.code}-label-double`}
                      onClick={() => {
                        setContextMenuProps({
                          title: ap.code
                        })
                        setContextMenuPosition({ x: getX(ap.longitude) + 20, y: getY(ap.latitude) - 100 })
                        setShowContextMenu(true)
                      }}
                      x={
                          getX(ap.longitude) + (
                            labelPositions && labelPositions[ap.code] && document.getElementById(`origin-${ap.code}-label`)
                            ?
                              labelPositions[ap.code].position == 'right'
                              ? 10
                              :
                                labelPositions[ap.code].position == 'left'
                                ? -(document.getElementById(`origin-${ap.code}-label`).getBBox().width + 10)
                                :
                                  labelPositions[ap.code].position == 'bottom'
                                  ? -(document.getElementById(`origin-${ap.code}-label`).getBBox().width * .5)
                                  :
                                    labelPositions[ap.code].position == 'top'
                                    ? -(document.getElementById(`origin-${ap.code}-label`).getBBox().width * .5)
                                    : 0

                            : 10
                          )
                        }
                      y={
                        getY(ap.latitude) + (
                          labelPositions && labelPositions[ap.code] && document.getElementById(`origin-${ap.code}-label`)
                          ?
                            labelPositions[ap.code].position == 'bottom'
                            ? (document.getElementById(`origin-${ap.code}-label`).getBBox().height)
                            :
                              labelPositions[ap.code].position == 'top'
                              ? -(document.getElementById(`origin-${ap.code}-label`).getBBox().height * .5)
                              : (document.getElementById(`origin-${ap.code}-label`).getBBox().height * .25)
                          : 0
                        )
                      }
                      style={{
                        textAlign: 'center',
                        cursor: 'pointer',
                        fontSize: originLabelFontSize,
                        fontWeight: 'bold'
                      }}
                      fontFamily='AmericanSans'
                      fontSize={originLabelFontSize}>
                        {
                          labelDisplayTypes && labelDisplayTypes[ap.code]
                          ?
                            labelDisplayTypes[ap.code].displayType == 'code'
                            ? ap.code
                            :
                              labelDisplayTypes[ap.code].displayType == 'city'
                              ? ap.city
                              :
                                labelDisplayTypes[ap.code].displayType == 'region'
                                ? ap.region
                                :
                                  labelDisplayTypes[ap.code].displayType == 'airport'
                                  ? `${ap.fullname}`
                                  :
                                    labelDisplayTypes[ap.code].displayType == 'city-and-code'
                                    ?
                                      `${ap.city},
                                       ${ap.code}`
                                    :
                                      `${ap.city},
                                       ${ap.code}`
                          : `${ap.city},
                             ${ap.code}`
                        }
                    </text>
                    <circle
                      style={{
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setContextMenuProps({
                          title: ap.code
                        })
                        setContextMenuPosition({ x: getX(ap.longitude) + 20, y: getY(ap.latitude) - 100 })
                        setShowContextMenu(true)
                      }}
                      r={originCircleSize}
                      cx={getX(ap.longitude)}
                      cy={getY(ap.latitude)}
                      fill={'#000'}
                      stroke={originCircleColor}></circle>
                  </g>
                </Fragment>
              ))
            : null
          }
          {
            listedLegalLines.map((line, i) => {
              if (line) {
                return (
                    <Fragment key={`legal-line-${line}`}>
                      <g>
                      <text
                        style={{ fontSize: '.5rem' }}
                        x={20}
                        y={innerHeight - (12 * i) - 10}>
                        * {line}
                      </text>
                    </g>
                  </Fragment>
                )
              }
            })
          }
        </svg>
        <MapContextMenu
          showContextMenu={showContextMenu}
          setShowContextMenu={setShowContextMenu}
          contextMenuProps={contextMenuProps}
          contextMenuPosition={contextMenuPosition}
          labelDisplayTypeAction={SET_LABEL_DISPLAY_TYPE_POINTMAP}
          labelPositionAction={SET_LABEL_POSITION_POINTMAP}
          />
      </div>
    </div>
  </>)

}

export default withRouter(GeneratePointmap)
