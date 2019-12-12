import * as d3 from 'd3'
import './generate-map.scss'
import url from '../../url'
import { getUser } from '../../sessionStore'
import React, { useState, useEffect, useRef, createRef, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserLeftSidePanel from '../Views/UserLeftSidePanel'
import DownloadImagePanel from '../Views/DownloadAndSavePanel'
import { SET_TIMEZONE_LATLONGS } from '../../constants/constants'
import {
  SET_LABEL_POSITION_SPIDERMAP, SET_LABEL_DISPLAY_TYPE_SPIDERMAP,
  SET_ALL_LABEL_POSITIONS_SPIDERMAP, SET_ALL_LABEL_DISPLAY_TYPES_SPIDERMAP,
} from '../../constants/spidermap'
import ChangeAllLabelsMenu from '../Menus/ChangeAllLabelsMenu'
import MapContextMenu from '../Menus/MapContextMenu'
import mapSettings from '../../mapSettings.config'
import { CSSTransition } from 'react-transition-group'
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

  // const [showChangeAllLabelsMenu, setShowChangeAllLabelsMenu] = useState(false)

  const labelPositions = useSelector(state => state.spidermap_labelPositions)

  const labelDisplayTypes = useSelector(state => state.spidermap_labelDisplayTypes)

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
    setShowContextMenu(true)
    setTimeout(() => setShowContextMenu(false), 10)
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
      // load timezone data
      if (!timezoneLatLongs) {
        axios.get('/timezones', { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
             .then(result => {
               console.log(result.data[0].all)
               dispatch({ type: SET_TIMEZONE_LATLONGS, payload: result.data[0].all })
             })
      }
    }
  }, [])

  const getX = long => {
    if (!longs.includes(long)) {
      let arr = destinations.map(ap => timezoneLatLongs[ap.timezone].longitude)
      longs = longs.concat(arr)
      longs = longs.concat(timezoneLatLongs[origin.timezone].longitude)
      longs.sort((a, b) => a - b)
    }
    linearScaleX = d3.scaleLinear()
                     .domain([longs[0], longs[longs.length-1]])
                     .range([svgMargin, (innerHeight * 1.15)])

    return linearScaleX(long)
  }

  const getY = lat => {
    if (!lats.includes(lat)) {
      let arr = destinations.map(ap => ap.latitude)
      lats = lats.concat(arr)
      lats = lats.concat(origin.latitude)
      // lats = lats.map()
      lats.sort((a, b) => b - a)
    }
    linearScaleY = d3.scaleLinear()
                     .domain([(lats[0] * -.5), lats.reduce((a, b) => a + b)])
                     .range([svgMargin, innerHeight - svgMargin])
    // the below evenly spaces Y values according to timezone
    return linearScaleY(((lats.reduce((a, b) => a + b) / lats.length)) * lats.indexOf(lat))
  }

  const calcPath = (ap, i) => {
    let cp1 = {}, cp2 = {}
    let startX, endX, distanceBetweenX
    let startY, endY, distanceBetweenY
    let bendX = 20
    let bendY = 30
    let cpStartThreshX = .25, cpEndThreshX = .75
    let cpStartThreshY = .25, cpEndThreshY = .75

    startX = getX(timezoneLatLongs[ap.timezone].longitude)
    endX = getX(timezoneLatLongs[origin.timezone].longitude)
    distanceBetweenX = endX - startX
    cp1.x = startX + (distanceBetweenX * cpStartThreshX)
    cp2.x = startX + (distanceBetweenX * cpEndThreshX)
    if (startX > endX) { cp1.x -= bendX; cp2.x -= bendX }
    else { cp1.x += bendX; cp2.x += bendX }

    startY = getY(ap.latitude)
    endY = getY(origin.latitude)
    distanceBetweenY = endY - startY
    cp1.y = startY + (distanceBetweenY * cpStartThreshY) - bendY
    cp2.y = startY + (distanceBetweenY * cpEndThreshY) - bendY

    // debug circles
    // <circle fill='#0000ff' r='2' cx={cp1.x} cy={cp1.y}></circle>
    // <circle fill='#e100ff' r='2' cx={cp2.x} cy={cp2.y}></circle>
    pathCount++

    return (
      <g>
        <path id={`${origin.code}-to-${ap.code}-path`} ref={ pathsRef.current[pathCount] }
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
          <rect onClick={() => setShowContextMenu(false)} width={innerWidth} height={innerHeight} fill='rgba(0,0,0,0)' opacity='0'></rect>
          {
            destinations
            ? destinations.map((ap, i) => (<Fragment key={'path'+i}>{calcPath(ap, i)}</Fragment>)) : null
          }
          {
            destinations
            ?
              destinations.map((ap, i) => (
                <Fragment key={ap.code}>
                  <g>
                  <circle
                    r={destinationDotSize}
                    cx={getX(timezoneLatLongs[ap.timezone].longitude)}
                    cy={getY(ap.latitude)}
                    fill={destinationDotColor}></circle>
                  <text
                    id={`destination-${ap.code}-label`}
                    ref={labelsRef.current[labelCount++]}
                    x={
                        getX(timezoneLatLongs[ap.timezone].longitude) + (
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
                        labelPositions && labelPositions[ap.code]
                        ?
                          labelPositions[ap.code].position == 'right'
                          ? 4
                          :
                            labelPositions[ap.code].position == 'left'
                            ? 4
                            :
                              labelPositions[ap.code].position == 'bottom'
                              ? 16
                              :
                                labelPositions[ap.code].position == 'top'
                                ? -10
                                : 0

                        : 4
                      )
                    }
                    style={{
                      textAlign: 'center',
                      pointerEvents: 'none'
                    }}
                    fontSize={destinationLabelFontSize}>
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
                                labelDisplayTypes[ap.code].displayType == 'full'
                                ? `${ap.code},
                                   ${ap.city},
                                   ${ap.region}`
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
                    style={{
                      pointerEvents: 'none', zIndex: -1
                    }}
                    id={`destination-${ap.code}-white-box-under-label`}
                    ref={whiteBoxUnderLabelsRef.current[whiteBoxUnderLabelCount++]}
                    x={
                        getX(timezoneLatLongs[ap.timezone].longitude) + (
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
                        labelPositions && labelPositions[ap.code]
                        ?
                          labelPositions[ap.code].position == 'right'
                          ? -4
                          :
                            labelPositions[ap.code].position == 'left'
                            ? -4
                            :
                              labelPositions[ap.code].position == 'bottom'
                              ? 8
                              :
                                labelPositions[ap.code].position == 'top'
                                ? -19
                                : 0

                        : -4
                      )
                    }
                    width={
                      document.getElementById(`destination-${ap.code}-label`) && document.getElementById(`destination-${ap.code}-label`).getBBox
                      ? document.getElementById(`destination-${ap.code}-label`).getBBox().width
                      : 100
                    }
                    height={
                      document.getElementById(`destination-${ap.code}-label`) && document.getElementById(`destination-${ap.code}-label`).getBBox
                      ? document.getElementById(`destination-${ap.code}-label`).getBBox().height
                      : 11
                    }
                    fill='#fff'></rect>
                    <text
                      id={`destination-${ap.code}-label-double`}
                      x={
                          getX(timezoneLatLongs[ap.timezone].longitude) + (
                            labelPositions && labelPositions[ap.code]  && document.getElementById(`destination-${ap.code}-label`)
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
                          labelPositions && labelPositions[ap.code]
                          ?
                            labelPositions[ap.code].position == 'right'
                            ? 4
                            :
                              labelPositions[ap.code].position == 'left'
                              ? 4
                              :
                                labelPositions[ap.code].position == 'bottom'
                                ? 16
                                :
                                  labelPositions[ap.code].position == 'top'
                                  ? -10
                                  : 0

                          : 4
                        )
                      }
                      style={{
                        textAlign: 'center',
                        pointerEvents: 'none'
                      }}
                      fontSize={destinationLabelFontSize}>
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
                                  labelDisplayTypes[ap.code].displayType == 'full'
                                  ? `${ap.code},
                                     ${ap.city},
                                     ${ap.region}`
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
                      style={{ cursor: 'pointer' }}
                      x={getX(timezoneLatLongs[ap.timezone].longitude) - 7}
                      y={getY(ap.latitude) - 7}
                      width='14'
                      height='14'
                      fill='rgba(0,0,0,0)'
                      opacity='0'
                      onClick={() => {
                      setContextMenuProps({
                        title: ap.code
                      })
                      setContextMenuPosition({ x: getX(timezoneLatLongs[ap.timezone].longitude)+20, y: getY(ap.latitude)-100 })
                      setShowContextMenu(true)
                    }}>
                    </rect>
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
                      cx={getX(timezoneLatLongs[origin.timezone].longitude)}
                      cy={getY(origin.latitude)}
                      fill={originDotColor}></circle>
              <circle r={originCircleSize}
                      cx={getX(timezoneLatLongs[origin.timezone].longitude)}
                      cy={getY(origin.latitude)}
                      fill='none'
                      stroke={originCircleColor}></circle>
                        <text
                          id={`origin-${origin.code}-label`}
                          x={
                              getX(timezoneLatLongs[origin.timezone].longitude) + (
                                labelPositions && labelPositions[origin.code] && document.getElementById(`origin-${origin.code}-label`)
                                ?
                                  labelPositions[origin.code].position == 'right'
                                  ? 10
                                  :
                                    labelPositions[origin.code].position == 'left'
                                    ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().width + 10)
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
                            getY(origin.latitude) + (
                              labelPositions && labelPositions[origin.code]
                              ?
                                labelPositions[origin.code].position == 'right'
                                ? 3
                                :
                                  labelPositions[origin.code].position == 'left'
                                  ? 3
                                  :
                                    labelPositions[origin.code].position == 'bottom'
                                    ? 16
                                    :
                                      labelPositions[origin.code].position == 'top'
                                      ? -10
                                      : 0

                              : 3
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
                                      labelDisplayTypes[origin.code].displayType == 'full'
                                      ? `${origin.code},
                                         ${origin.city},
                                         ${origin.region}`
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
                          style={{
                            pointerEvents: 'none', zIndex: -1
                          }}
                          id={`origin-${origin.code}-white-box-under-label`}
                          ref={whiteBoxUnderLabelsRef.current[whiteBoxUnderLabelCount++]}
                          x={
                              getX(timezoneLatLongs[origin.timezone].longitude) + (
                                labelPositions && labelPositions[origin.code] && document.getElementById(`origin-${origin.code}-label`)
                                ?
                                  labelPositions[origin.code].position == 'right'
                                  ? 10
                                  :
                                    labelPositions[origin.code].position == 'left'
                                    ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().width + 10)
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
                            getY(origin.latitude) + (
                              labelPositions && labelPositions[origin.code]
                              ?
                                labelPositions[origin.code].position == 'right'
                                ? -6
                                :
                                  labelPositions[origin.code].position == 'left'
                                  ? -6
                                  :
                                    labelPositions[origin.code].position == 'bottom'
                                    ? 8
                                    :
                                      labelPositions[origin.code].position == 'top'
                                      ? -19
                                      : 0

                              : -6
                            )
                          }
                          width={
                            document.getElementById(`origin-${origin.code}-label`)
                            ?
                              document.getElementById(`origin-${origin.code}-label`).getBBox().width
                            :
                              100
                          }
                          height={
                            document.getElementById(`origin-${origin.code}-label`)
                            ?
                              document.getElementById(`origin-${origin.code}-label`).getBBox().height
                            :
                              10
                          }
                          fill='#fff'></rect>
                          <text
                            id={`origin-${origin.code}-label-double`}
                            x={
                                getX(timezoneLatLongs[origin.timezone].longitude) + (
                                  labelPositions && labelPositions[origin.code] && document.getElementById(`origin-${origin.code}-label`)
                                  ?
                                    labelPositions[origin.code].position == 'right'
                                    ? 10
                                    :
                                      labelPositions[origin.code].position == 'left'
                                      ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().width + 10)
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
                              getY(origin.latitude) + (
                                labelPositions && labelPositions[origin.code]
                                ?
                                  labelPositions[origin.code].position == 'right'
                                  ? 3
                                  :
                                    labelPositions[origin.code].position == 'left'
                                    ? 3
                                    :
                                      labelPositions[origin.code].position == 'bottom'
                                      ? 16
                                      :
                                        labelPositions[origin.code].position == 'top'
                                        ? -10
                                        : 0

                                : 3
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
                                        labelDisplayTypes[origin.code].displayType == 'full'
                                        ? `${origin.code},
                                           ${origin.city},
                                           ${origin.region}`
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
                            style={{ cursor: 'pointer' }}
                            x={getX(timezoneLatLongs[origin.timezone].longitude) - 7}
                            y={getY(origin.latitude) - 7}
                            width='14'
                            height='14'
                            fill='rgba(0,0,0,0)'
                            opacity='0'
                            onClick={() => {
                            setContextMenuProps({
                              title: origin.code
                            })
                            setContextMenuPosition({ x: getX(timezoneLatLongs[origin.timezone].longitude)+20, y: getY(origin.latitude)-100 })
                            setShowContextMenu(true)
                          }}></rect>
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
