import * as d3 from 'd3'
import './generate-map.scss'
import url from '../../url'
import { getUser } from '../../sessionStore'
import React, { useState, useEffect, useRef, createRef, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserLeftSidePanel from '../Views/UserLeftSidePanel'
import DownloadImagePanel from '../Views/DownloadAndSavePanel'
import { SET_TIMEZONE_LATLONGS, RERENDER_HACK } from '../../constants/constants'
import {
  SET_LABEL_POSITION_SPIDERMAP, SET_LABEL_DISPLAY_TYPE_SPIDERMAP,
  SET_ALL_LABEL_POSITIONS_SPIDERMAP, SET_ALL_LABEL_DISPLAY_TYPES_SPIDERMAP,
} from '../../constants/spidermap'
import ChangeAllLabelsMenu from '../Menus/ChangeAllLabelsMenu'
import MapContextMenu from '../Menus/MapContextMenu'
import mapSettings from '../../mapSettings.config'
import { CSSTransition } from 'react-transition-group'
import intersect from 'path-intersection'
import axios from 'axios'

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
  let labelAdjustX = 2,
      labelAdjustY = 2

  let points = {}

  const dispatch = useDispatch()

  const origin = useSelector(state => state.selectedOriginSpidermap)

  const destinations = useSelector(state => state.selectedDestinationsSpidermap)

  const downloadingPDF = useSelector(state => state.downloadPDFStatus)

  const pathsRef = useRef(destinations.map(() => createRef()))

  const labelsRef = useRef(destinations.concat(origin).map(() => createRef()))

  const whiteBoxUnderLabelsRef = useRef(destinations.concat(origin).map(() => createRef()))

  const displayMapBG = useSelector(state => state.displayMapBG)

  const timezoneLatLongs = useSelector(state => state.timezoneLatLongs)

  const [listedLegalLines, setListedLegalLines] = useState([])

  const [showContextMenu, setShowContextMenu] = useState(false)

  const [contextMenuPosition, setContextMenuPosition] = useState({})

  const [contextMenuProps, setContextMenuProps] = useState({})

  const [showChangeAllLabelsMenu, setShowChangeAllLabelsMenu] = useState(false)

  const labelPositions = useSelector(state => state.spidermap_labelPositions)

  const labelDisplayTypes = useSelector(state => state.spidermap_labelDisplayTypes)

  const exportFileType = useSelector(state => state.exportFileType)

  const rerenderHack = useSelector(state => state.rerenderHack)

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
    setTimeout(() => dispatch({ type: RERENDER_HACK, payload: false }), 50)
  }

  useEffect(() => {
    if (origin == null) {
      props.history.push('/spidermap')
    } else {
      pathsRef.current.forEach(path => console.log(path))
      labelsRef.current.forEach(label => console.log(label))
      let legal = destinations.concat(origin).map(item => { if (item && item.legal) return item.legal })
      legal = legal.filter((item, i) => i == legal.indexOf(item))
      setListedLegalLines(legal)
      destinations.concat(origin).forEach(loc => {
        if (!labelPositions || !labelPositions[loc.code] || !labelPositions[loc.code].position) {
          dispatch({ type: SET_LABEL_POSITION_SPIDERMAP, which: loc.code, position: 'right' })
        }
        if (labelDisplayTypes && (!labelDisplayTypes[loc.code] || !labelDisplayTypes[loc.code].displayType)) {
          dispatch({ type: SET_LABEL_DISPLAY_TYPE_SPIDERMAP, which: loc.code, position: 'city-code' })
        }
      })
      // hack to re-render svg data
      dispatch({ type: RERENDER_HACK, payload: true })
      setTimeout(() => dispatch({ type: RERENDER_HACK, payload: false }), 5)
      // load timezone data
      if (!timezoneLatLongs) {
        axios.get('/timezones', { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
             .then(result => {
               console.log(result.data[0].all)
               dispatch({ type: SET_TIMEZONE_LATLONGS, payload: result.data[0].all })
               // hack to re-render svg data
               dispatch({ type: RERENDER_HACK, payload: true })
               setTimeout(() => dispatch({ type: RERENDER_HACK, payload: false }), 5)
             })
      }
    }
  }, [])

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

  const getX = long => {

  }

  const getY = lat => {

  }

  const calcPath = (ap, i) => {
    // let get_x = ap.longitude < -85 ? getX(-60) : getX(ap.longitude)
    let center = calcCenter()
    // let ring = getRingBasedOnLat(origin, ap)
    // let cp1 = {
    //
    // },
    // cp2 = {
    //
    // }
    // let startX, endX, distanceBetweenX
    // let startY, endY, distanceBetweenY
    let cpStartThreshX = .3, cpEndThreshX = .7
    let cpStartThreshY = .3, cpEndThreshY = .7
    let bendX, bendY

    pathCount++

    let angle = 360/destinations.length * pathCount
    let pointY = 50
    // angle = (angle == Infinity ? 1 : angle)

    // if (pathsRef.current && pathsRef.current[pathCount] && pathsRef.current[pathCount].current) {
    //   console.log(
    //     pathsRef.current[pathCount].current.getPointAtLength(100)
    //   )
    // }

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
            C ${center.x * .9}, ${center.y * .7}
              ${center.x * .9}, ${center.y * .3}
              ${center.x}, ${pointY}
            `
            /*
            `
            M ${center.x},${center.y}
            C ${center.x},${0}
            ${center.x},${0}
            ${center.x},${150}
            `
          */}
          strokeWidth={pathStrokeThickness}
          stroke={pathStrokeColor}
          fill='none'>
        </path>
        <circle
          r={destinationDotSize}
          cx={center.x}
          cy={
            pointY
            /*
            innerHeight < 800
            ? 60 - ((800 - innerHeight)*.05)
            : 60
            */
          }
          fill={destinationDotColor}>
        </circle>
      </g>
    )


  }

  return (<>
    {
      timezoneLatLongs
      ?
    <div className='row'>
      <UserLeftSidePanel/>
      <DownloadImagePanel type='spidermap' label='Spider Map'/>
      <div
        id='map-content'
        className='col-med pdf-content'
        style={{
          height:'100vh',
          backgroundColor: '#fff',
        }}>
        <ChangeAllLabelsMenu
          showChangeAllLabelsMenu={showChangeAllLabelsMenu}
          setShowChangeAllLabelsMenu={setShowChangeAllLabelsMenu}
          changeAllLabelPositions={changeAllLabelPositions}
          changeAllLabelDisplayTypes={changeAllLabelDisplayTypes}/>
        <svg
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
            ? destinations.map((ap, i) => (
                <Fragment key={'path'+i}>
                  { calcPath(ap, i) }
                </Fragment>)
              ) : null
          }
          {
            destinations
            ?
              destinations.map((ap, i) => (
                <Fragment key={ap.code}>
                  <g>
                  <circle
                    style={{
                      cursor: 'pointer',
                    }}
                    onClick={()=>{}}
                    r={destinationDotSize}

                    fill={destinationDotColor}></circle>
                  <text
                    id={`destination-${ap.code}-label`}
                    ref={labelsRef.current[labelCount++]}
                    style={{ textAlign: 'center' }}
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
                    onClick={()=>{}}
                    style={{ cursor: 'pointer' }}

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
                    fill={ /*exportFileType == 'PNG' ? 'rgba(0,0,0,0)' : '#fff'*/
                      '#fff'
                    }>
                    </rect>
                    <text
                      id={`destination-${ap.code}-label-double`}
                      onClick={()=>{}}
                      style={{ textAlign: 'center', cursor: 'pointer' }}
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
            : null
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
                                ? (document.getElementById(`origin-${origin.code}-label`).getBBox().height * .5) - 2
                                :
                                  labelPositions[origin.code].position == 'top'
                                  ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().height * 1.35)
                                  :
                                    -(document.getElementById(`origin-${origin.code}-label`).getBBox().height * .5) - 2
                              : 0
                            )
                          }
                          width={
                            document.getElementById(`origin-${origin.code}-label`)
                            ?
                              document.getElementById(`origin-${origin.code}-label`).getBBox().width + 5
                            :
                              100
                          }
                          height={
                            document.getElementById(`origin-${origin.code}-label`)
                            ?
                              document.getElementById(`origin-${origin.code}-label`).getBBox().height
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
                              cursor: 'pointer'
                            }}
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
                          {/*<rect
                            style={{ cursor: 'pointer' }}
                            x={calcCenter().x - 7}
                            y={calcCenter().y - 7}
                            width='14'
                            height='14'
                            fill='rgba(0,0,0,0)'
                            opacity='0'
                            onClick={() => {
                            setContextMenuProps({
                              title: origin.code
                            })
                            setContextMenuPosition({ x: calcCenter().x + 20, y: calcCenter().y - 100 })
                            setShowContextMenu(true)
                          }}></rect>*/}
              </g>
            </>)
            : null
          }
          {/*
            <g>
              <path
                style={{
                  pointerEvents: 'none'
                }}
                fill={'none'}
                stroke={'#000'}
                d={ ringOne }>
              </path>
              <path
                style={{
                  pointerEvents: 'none'
                }}
                fill={'none'}
                stroke={'#000'}
                d={ ringTwo }>
              </path>
              <path
                style={{
                  pointerEvents: 'none'
                }}
                fill={'none'}
                stroke={'#000'}
                d={ ringThree }>
              </path>
              <path
                style={{
                  pointerEvents: 'none'
                }}
                fill={'none'}
                stroke={'#000'}
                d={ ringFour }>
              </path>
              <path
                style={{
                  pointerEvents: 'none'
                }}
                fill={'none'}
                stroke={'#000'}
                d={ ringFive }>
              </path>
              <path
                style={{
                  pointerEvents: 'none'
                }}
                fill={'none'}
                stroke={'#000'}
                d={ ringSix }>
              </path>
              <path
                style={{
                  pointerEvents: 'none'
                }}
                fill={'none'}
                stroke={'#000'}
                d={ ringSeven }>
              </path>
            </g>
          */}
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
    : null
  }
  </>)

}

export default GenerateSpidermap
