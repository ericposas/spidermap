import * as d3 from 'd3'
import './generate-map.scss'
import geodist from 'geodist'
import url from '../../url'
import { getUser } from '../../sessionStore'
import React, { useState, useEffect, useRef, createRef, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserLeftSidePanel from '../Views/UserLeftSidePanel'
import DownloadImagePanel from '../Views/DownloadAndSavePanel'
import { RERENDER_HACK } from '../../constants/constants'
import {
  SET_LABEL_POSITION_SPIDERMAP, SET_LABEL_DISPLAY_TYPE_SPIDERMAP,
  SET_ALL_LABEL_POSITIONS_SPIDERMAP, SET_ALL_LABEL_DISPLAY_TYPES_SPIDERMAP,
  SET_DESTINATION_LOCATIONS_SPIDERMAP,
  SET_SPIDERMAP_DISTLIMIT, SET_SPIDERMAP_RENDERTYPE, SET_SPIDERMAP_ANGLEADJUST,
} from '../../constants/spidermap'
import ChangeAllLabelsMenu from '../Menus/ChangeAllLabelsMenu'
import MapContextMenu from '../Menus/MapContextMenu'
import mapSettings from '../../mapSettings.config'
import { CSSTransition } from 'react-transition-group'
import intersect from 'path-intersection'
import axios from 'axios'
import arrow from '../../images/down-arrow.png'

const GenerateSpidermap = ({ ...props }) => {

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
  let longPaths = -1, shortPaths = -1
  let labelAdjustX = 2,
      labelAdjustY = 2
  // let shortPathsCalculated = false
  // let distLimit = 2000

  let points = {}

  const dispatch = useDispatch()

  const origin = useSelector(state => state.selectedOriginSpidermap)

  const destinations = useSelector(state => state.selectedDestinationsSpidermap)

  // const [distLimit, setDistLimit] = useState(2000)
  const distLimit = useSelector(state => state.spidermap_distLimit)

  // const [renderType, setRenderType] = useState('single-ring')
  const renderType = useSelector(state => state.spidermap_renderType)

  // const [angleAdjustment, setAngleAdjustment] = useState(1.0)
  const angleAdjustment = useSelector(state => state.spidermap_angleAdjustment)

  const downloadingPDF = useSelector(state => state.downloadPDFStatus)

  const pathsRef = useRef(destinations.map(() => createRef()))

  const circlesRef = useRef(destinations.map(() => createRef()))

  const labelsRef = useRef(destinations.concat(origin).map(() => createRef()))

  const whiteBoxUnderLabelsRef = useRef(destinations.concat(origin).map(() => createRef()))

  const displayMapBG = useSelector(state => state.displayMapBG)

  // const timezoneLatLongs = useSelector(state => state.timezoneLatLongs)

  const [listedLegalLines, setListedLegalLines] = useState([])

  const [showContextMenu, setShowContextMenu] = useState(false)

  const [contextMenuPosition, setContextMenuPosition] = useState({})

  const [contextMenuProps, setContextMenuProps] = useState({})

  const [showChangeAllLabelsMenu, setShowChangeAllLabelsMenu] = useState(false)

  const labelPositions = useSelector(state => state.spidermap_labelPositions)

  const labelDisplayTypes = useSelector(state => state.spidermap_labelDisplayTypes)

  const exportFileType = useSelector(state => state.exportFileType)

  const rerenderHack = useSelector(state => state.rerenderHack)

  const svg_map_area = useRef()

  const leftPanelsRef = useRef()

  const ringTypeToggleMenuRef = useRef()

  const changeAllLabelPositions = e => {
    let val = e.target.value
    let obj = {}
    let codes = destinations.concat(origin)
                  .map(loc => loc.code)
    codes.forEach(code => obj[code] = { position: val })
    dispatch({ type: SET_ALL_LABEL_POSITIONS_SPIDERMAP, payload: obj })
  }

  const changeAllLabelDisplayTypes = e => {
    let val = e.target.value
    let obj = {}
    let codes = destinations.concat(origin)
                  .map(loc => loc.code)
    codes.forEach(code => obj[code] = { displayType: val })
    dispatch({ type: SET_ALL_LABEL_DISPLAY_TYPES_SPIDERMAP, payload: obj })
    // hack to re-render svg data
    dispatch({ type: RERENDER_HACK, payload: true })
    setTimeout(() => dispatch({ type: RERENDER_HACK, payload: false }), 100)
  }

  useEffect(() => {
    if (origin == null) {
      props.history.push('/spidermap')
    } else {
      let legal = destinations.concat(origin).map(item => { if (item && item.legal) return item.legal })
      legal = legal.filter((item, i) => i == legal.indexOf(item))
      setListedLegalLines(legal)
      destinations.concat(origin).forEach((loc, idx) => {
        if (!labelPositions || !labelPositions[loc.code] || !labelPositions[loc.code].position) {
          if (idx > destinations.length/2) {
            dispatch({ type: SET_LABEL_POSITION_SPIDERMAP, which: loc.code, position: 'left' })
          } else {
            dispatch({ type: SET_LABEL_POSITION_SPIDERMAP, which: loc.code, position: 'right' })
          }
        }
        if (labelDisplayTypes && (!labelDisplayTypes[loc.code] || !labelDisplayTypes[loc.code].displayType)) {
          dispatch({ type: SET_LABEL_DISPLAY_TYPE_SPIDERMAP, which: loc.code, position: 'city-code' })
        }
      })
      // hack to re-render svg data
      dispatch({ type: RERENDER_HACK, payload: true })
      setTimeout(() => dispatch({ type: RERENDER_HACK, payload: false }), 200)
    }
  }, [])

  // useEffect(() => {
  //
  // }, [])

  const calcCenter = () => {
    return {
      x: ((svgMargin + (innerHeight * 1.15))/2),
      y: ((svgMargin + (innerHeight - svgMargin))/2),
    }
  }

  const getGraphDimensions = () => {
    return {
      w: (svgMargin + (innerHeight * 1.15)),
      h: (svgMargin + (innerHeight - svgMargin))
    }
  }

  const calcContextMenuPos = (e, code, center) => {
    let x = e.clientX - svg_map_area.current.getBoundingClientRect().left
    let xPos = x < center.x ? x - 100 : x - 200
    let yPos = e.clientY < center.y ? e.clientY + 20 : e.clientY - 200
    setContextMenuProps({
      title: code
    })
    setContextMenuPosition({
      x: xPos,
      y: yPos
    })
    setShowContextMenu(true)
  }

  const calcPath = (ap, i) => {
    let center = calcCenter()
    let cpStartThreshX = .3, cpEndThreshX = .7
    let cpStartThreshY = .3, cpEndThreshY = .7
    let bendX, bendY
    let orig = { lat: origin.latitude, lon: origin.longitude }
    let dest = { lat: ap.latitude, lon: ap.longitude }
    let distance = geodist(orig, dest)
    let pointY, xcurve1, xcurve2, ycurve1, ycurve2
    let angle

    pathCount++

    if (renderType == 'double-ring') {
      if (distance > distLimit) {
        pointY = 50
        xcurve1 = .85
        xcurve2 = .85
        ycurve1 = .75
        ycurve2 = .6
        longPaths++
        angle = (360/destinations.length * pathCount) + angleAdjustment
      } else {
        pointY = 150
        xcurve1 = .9
        xcurve2 = .9
        ycurve1 = .8
        ycurve2 = .6
        shortPaths++
        angle = (360/destinations.length * pathCount)
      }
    } else {
      pointY = 50
      xcurve1 = .85
      xcurve2 = .85
      ycurve1 = .75
      ycurve2 = .6
      angle = (360/destinations.length * pathCount)
    }

    return (
      <g
        transform={
          `rotate(${angle}, ${center.x}, ${center.y})`
        }>
        <path
          id={`${origin.code}-to-${ap.code}-path`}
          ref={ pathsRef.current[pathCount] }
          d={
            `
            M ${center.x}, ${center.y}
            C ${center.x * xcurve1}, ${center.y * ycurve1}
              ${center.x * xcurve2}, ${center.y * ycurve2}
              ${center.x}, ${pointY}
            `
          }
          strokeWidth={pathStrokeThickness}
          stroke={pathStrokeColor}
          fill='none'>
        </path>
        <circle
          id={`${origin.code}-to-${ap.code}-dot`}
          ref={ circlesRef.current[pathCount] }
          onClick={e => calcContextMenuPos(e, ap.code, center)}
          r={destinationDotSize}
          cx={center.x}
          cy={pointY}
          fill={destinationDotColor}>
        </circle>
        <rect
          id={`destination-${ap.code}-white-box-under-label`}
          ref={whiteBoxUnderLabelsRef.current[whiteBoxUnderLabelCount++]}
          transform={
            `rotate(${-angle}, ${center.x}, ${pointY})`
          }
          onClick={e => calcContextMenuPos(e, ap.code, center)}
          style={{
            cursor: 'pointer',
            opacity:
              document.getElementById(`origin-${ap.code}-label`)
              ? 0
              : 1
          }}
          x={
              center.x + (
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
            pointY + (
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
          id={`destination-${ap.code}-label`}
          ref={labelsRef.current[labelCount++]}
          transform={
            `rotate(${-angle}, ${center.x}, ${pointY})`
          }
          style={{
            'pointerEvents': 'none'
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
          }
          x={
            center.x + (
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
            pointY + (
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
    )


  }

  return (
    <>
    <div className='row'>
      <UserLeftSidePanel/>
      <DownloadImagePanel type='spidermap' label='Spider Map'/>
      <div
        id='map-content'
        className='col-med pdf-content'
        style={{
          height:'100vh',
          position: 'relative',
          backgroundColor: '#fff',
        }}>
        <div
          ref={ringTypeToggleMenuRef}
          style={{
            marginLeft: '10px',
            position: 'absolute',
            cursor: 'pointer'
          }}
          >
          <div
            onClick={() => {
              if (renderType == 'single-ring') dispatch({ type: SET_SPIDERMAP_RENDERTYPE, payload: 'double-ring' })
              else dispatch({ type: SET_SPIDERMAP_RENDERTYPE, payload: 'single-ring' })
            }}
            >
            <div
              style={{
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '4px 4px 0 4px',
                display: 'inline-block'
              }}
              >
              Ring type: {
                renderType == 'single-ring'
                ? 'Single'
                :
                renderType == 'double-ring'
                ? 'Double'
                : 'Default'
              }
            </div>
            <img
              src={arrow}
              style={{
                width: '14px',
                display: 'inline-block',
                transform: (
                  renderType != 'double-ring'
                  ? 'rotate(180deg)'
                  : 'rotate(0deg)'
                ),
                marginTop: '-3px',
                marginLeft: '6px'
              }}
              />
          </div>
          {
            renderType == 'double-ring'
            ? <div
                style={{ float: 'left' }}
                >
                <div
                  style={{ fontSize: '10px', padding: '0 4px 0 4px' }}>
                    Set distance threshhold for inner-ring:
                </div>
                <input
                  type='text'
                  style={{
                    backgroundColor: 'rgba(0,0,0,0)'
                  }}
                  value={distLimit}
                  onChange={e => dispatch({ type: SET_SPIDERMAP_DISTLIMIT, payload: e.target.value })}
                  />
              </div>
            : null
          }
          {
            renderType == 'double-ring'
            ? <div>
                <div
                  style={{ fontSize: '12px', padding: '0 4px 0 4px' }}>
                    Adjust angle of outer ring
                </div>
              <div>
              <div
                className='spidermap-ring-adjust-minus'
                style={{
                  display: 'inline-block',
                  userSelect: 'none',
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  textAlign: 'center',
                  width: '25px',
                  borderRadius: '20px'
                }}
                onClick={() => dispatch({ type: SET_SPIDERMAP_ANGLEADJUST, payload: (angleAdjustment - 1) })}
                >-</div>
              <div
                className='spidermap-ring-adjust-plus'
                style={{
                  display: 'inline-block',
                  userSelect: 'none',
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  textAlign: 'center',
                  width: '25px',
                  borderRadius: '20px',
                  leftMargin: '10px'
                }}
                onClick={() => dispatch({ type: SET_SPIDERMAP_ANGLEADJUST, payload: (angleAdjustment + 1) }) }
                >+</div>
            </div>
          </div>
          : null
        }
        </div>
        <ChangeAllLabelsMenu
          leftMargin={
            renderType == 'single-ring'
            ? '150px'
            :
              renderType == 'double-ring'
              ? '175px'
              : '155px'
          }
          showChangeAllLabelsMenu={showChangeAllLabelsMenu}
          setShowChangeAllLabelsMenu={setShowChangeAllLabelsMenu}
          changeAllLabelPositions={changeAllLabelPositions}
          changeAllLabelDisplayTypes={changeAllLabelDisplayTypes}/>
        <svg
          ref={ svg_map_area }
          className='svg-map-area'
          width={ downloadingPDF ? 800 : (innerHeight * 1.25) }
          height={ downloadingPDF ? 800 : innerHeight }
          style={{
            backgroundColor: displayMapBG ? svgBgColor : 'rgba(0, 0, 0, 0)',
            boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
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
            ? destinations
                .map((ap, i) => (
                  <Fragment key={'path'+i}>
                    { calcPath(ap, i) }
                  </Fragment>)
                ) : null
          }
          {
            origin
            ?
            (<>
              <g>
              <circle r={originDotSize}
                      cx={calcCenter().x}
                      cy={calcCenter().y}
                      fill={originDotColor}></circle>
              <circle
                style={{
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setContextMenuProps({
                    title: origin.code
                  })
                  setContextMenuPosition({ x: calcCenter().x + 20, y: calcCenter().y - 100 })
                  setShowContextMenu(true)
                }}
                r={originCircleSize}
                cx={calcCenter().x}
                cy={calcCenter().y}
                fill={'#000'}
                stroke={originCircleColor}></circle>
                    <text
                          id={`origin-${origin.code}-label`}
                          x={
                              calcCenter().x + (
                                labelPositions && labelPositions[origin.code] && document.getElementById(`origin-${origin.code}-label`)
                                ?
                                  labelPositions[origin.code].position == 'right'
                                  ? 10
                                  :
                                    labelPositions[origin.code].position == 'left'
                                    ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().width + 14)
                                    :
                                      labelPositions[origin.code].position == 'bottom'
                                      ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().width * .5)
                                      :
                                        labelPositions[origin.code].position == 'top'
                                        ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().width * .5)
                                        : 0

                                : 10
                              )
                            }
                          y={
                            calcCenter().y + (
                              labelPositions && labelPositions[origin.code] && document.getElementById(`origin-${origin.code}-label`)
                              ?
                                labelPositions[origin.code].position == 'bottom'
                                ? (document.getElementById(`origin-${origin.code}-label`).getBBox().height + 5)
                                :
                                  labelPositions[origin.code].position == 'top'
                                  ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().height * .5)
                                  :
                                    (document.getElementById(`origin-${origin.code}-label`).getBBox().height * .25)
                              : 0
                            )
                          }
                          style={{
                            textAlign: 'center', pointerEvents: 'none',
                            fontWeight: 'bold'
                          }}
                          fontFamily='AmericanSans'
                          fontSize={originLabelFontSize}>
                            {
                              labelDisplayTypes && labelDisplayTypes[origin.code]
                              ?
                                labelDisplayTypes[origin.code].displayType == 'code'
                                ? origin.code
                                :
                                  labelDisplayTypes[origin.code].displayType == 'city'
                                  ? origin.city
                                  :
                                    labelDisplayTypes[origin.code].displayType == 'region'
                                    ? origin.region
                                    :
                                      labelDisplayTypes[origin.code].displayType == 'airport'
                                      ? `${origin.fullname}`
                                      :
                                        labelDisplayTypes[origin.code].displayType == 'city-and-code'
                                        ?
                                          `${origin.city},
                                           ${origin.code}`
                                        :
                                          `${origin.city},
                                           ${origin.code}`
                              : `${origin.city},
                                 ${origin.code}`
                            }
                        </text>
                        <rect
                          onClick={() => {
                            setContextMenuProps({
                              title: origin.code
                            })
                            setContextMenuPosition({ x: calcCenter().x + 20, y: calcCenter().y - 100 })
                            setShowContextMenu(true)
                          }}
                          style={{
                            cursor: 'pointer'
                          }}
                          id={`origin-${origin.code}-white-box-under-label`}
                          ref={whiteBoxUnderLabelsRef.current[whiteBoxUnderLabelCount++]}
                          x={
                              calcCenter().x + (
                                labelPositions && labelPositions[origin.code] && document.getElementById(`origin-${origin.code}-label`)
                                ?
                                  labelPositions[origin.code].position == 'right'
                                  ? 8
                                  :
                                    labelPositions[origin.code].position == 'left'
                                    ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().width + 19)
                                    :
                                      labelPositions[origin.code].position == 'bottom'
                                      ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().width * .51)
                                      :
                                        labelPositions[origin.code].position == 'top'
                                        ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().width * .55)
                                        : 0
                                : 10
                              )
                            }
                          y={
                            calcCenter().y + (
                              labelPositions && labelPositions[origin.code] && document.getElementById(`origin-${origin.code}-label`)
                              ?
                                labelPositions[origin.code].position == 'bottom'
                                ? (document.getElementById(`origin-${origin.code}-label`).getBBox().height * .5) - 3
                                :
                                  labelPositions[origin.code].position == 'top'
                                  ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().height * 1.5)
                                  :
                                    -(document.getElementById(`origin-${origin.code}-label`).getBBox().height * .5) - 4
                              : 0
                            )
                          }
                          width={
                            document.getElementById(`origin-${origin.code}-label`)
                            ?
                              document.getElementById(`origin-${origin.code}-label`).getBBox().width + 8
                            :
                              100
                          }
                          height={
                            document.getElementById(`origin-${origin.code}-label`)
                            ?
                              document.getElementById(`origin-${origin.code}-label`).getBBox().height + 4
                            :
                              12
                          }
                          fill='#fff'></rect>
                          <text
                            id={`origin-${origin.code}-label-double`}
                            onClick={() => {
                              setContextMenuProps({
                                title: origin.code
                              })
                              setContextMenuPosition({ x: calcCenter().x + 20, y: calcCenter().y - 100 })
                              setShowContextMenu(true)
                            }}
                            x={
                                calcCenter().x + (
                                  labelPositions && labelPositions[origin.code] && document.getElementById(`origin-${origin.code}-label`)
                                  ?
                                    labelPositions[origin.code].position == 'right'
                                    ? 10
                                    :
                                      labelPositions[origin.code].position == 'left'
                                      ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().width + 14)
                                      :
                                        labelPositions[origin.code].position == 'bottom'
                                        ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().width * .5)
                                        :
                                          labelPositions[origin.code].position == 'top'
                                          ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().width * .5)
                                          : 0

                                  : 10
                                )
                              }
                            y={
                              calcCenter().y + (
                                labelPositions && labelPositions[origin.code] && document.getElementById(`origin-${origin.code}-label`)
                                ?
                                  labelPositions[origin.code].position == 'bottom'
                                  ? (document.getElementById(`origin-${origin.code}-label`).getBBox().height + 5)
                                  :
                                    labelPositions[origin.code].position == 'top'
                                    ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().height * .5)
                                    :
                                      (document.getElementById(`origin-${origin.code}-label`).getBBox().height * .25)
                                : 0
                              )
                            }
                            style={{
                              textAlign: 'center',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              fontSize: originLabelFontSize
                            }}
                            fontFamily='AmericanSans'
                            fontSize={originLabelFontSize}>
                              {
                                labelDisplayTypes && labelDisplayTypes[origin.code]
                                ?
                                  labelDisplayTypes[origin.code].displayType == 'code'
                                  ? origin.code
                                  :
                                    labelDisplayTypes[origin.code].displayType == 'city'
                                    ? origin.city
                                    :
                                      labelDisplayTypes[origin.code].displayType == 'region'
                                      ? origin.region
                                      :
                                        labelDisplayTypes[origin.code].displayType == 'airport'
                                        ? `${origin.fullname}`
                                        :
                                          labelDisplayTypes[origin.code].displayType == 'city-and-code'
                                          ?
                                            `${origin.city},
                                             ${origin.code}`
                                          :
                                            `${origin.city},
                                             ${origin.code}`
                                : `${origin.city},
                                   ${origin.code}`
                              }
                          </text>
              </g>
            </>)
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
          {
            rerenderHack
            ? <></>
            : null
          }
        </svg>
        <MapContextMenu
          showContextMenu={showContextMenu}
          setShowContextMenu={setShowContextMenu}
          contextMenuProps={contextMenuProps}
          contextMenuPosition={contextMenuPosition}
          labelDisplayTypeAction={SET_LABEL_DISPLAY_TYPE_SPIDERMAP}
          labelPositionAction={SET_LABEL_POSITION_SPIDERMAP}
          />
      </div>
    </div>
  </>)

}

export default GenerateSpidermap
