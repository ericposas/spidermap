import * as d3 from 'd3'
import './generate-map.scss'
import url from '../../url'
import { getUser } from '../../sessionStore'
import React, { useState, useEffect, useRef, createRef, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserLeftSidePanel from '../Views/UserLeftSidePanel'
import DownloadImagePanel from '../Views/DownloadAndSavePanel'
import mapSettings from '../../mapSettings.config'
import { CSSTransition } from 'react-transition-group'

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

  const origin = useSelector(state => state.selectedOriginSpidermap)

  const destinations = useSelector(state => state.selectedDestinationsSpidermap)

  const downloadingPDF = useSelector(state => state.downloadPDFStatus)

  const pathsRef = useRef(destinations.map(() => createRef()))

  const labelsRef = useRef(destinations.concat(origin).map(() => createRef()))

  const whiteBoxUnderLabelsRef = useRef(destinations.concat(origin).map(() => createRef()))

  const displayMapBG = useSelector(state => state.displayMapBG)

  const [listedLegalLines, setListedLegalLines] = useState([])

  const [showContextMenu, setShowContextMenu] = useState(false)

  const [contextMenuPosition, setContextMenuPosition] = useState({})

  const [contextMenuProps, setContextMenuProps] = useState({})

  const [labelPositions, setLabelPositions] = useState({})

  const [labelDisplayTypes, setLabelDisplayTypes] = useState({})

  useEffect(() => {
    if (origin == null) {
      props.history.push('/spidermap')
    } else {
      pathsRef.current.forEach(path => console.log(path))
      labelsRef.current.forEach(label => console.log(label))
      let legal = destinations.concat(origin).map(item => { if (item && item.legal) return item.legal })
      legal = legal.filter((item, i) => i == legal.indexOf(item))
      setListedLegalLines(legal)
    }
  }, [])

  const getX = long => {
    if (!longs.includes(long)) {
      let arr = destinations.map(ap => ap.longitude)
      longs = longs.concat(arr)
      longs = longs.concat(origin.longitude)
      longs.sort((a, b) => a - b)
    }
    linearScaleX = d3.scaleLinear()
                     .domain([longs[0], longs[longs.length-1]])
                     .range([svgMargin, (innerHeight * 1.15) - svgMargin])

    return linearScaleX(long)
  }

  const getY = lat => {
    if (!lats.includes(lat)) {
      let arr = destinations.map(ap => ap.latitude)
      lats = lats.concat(arr)
      lats = lats.concat(origin.latitude)
      lats.sort((a, b) => b - a)
    }
    linearScaleY = d3.scaleLinear()
                     .domain([lats[0], lats[lats.length-1]])
                     .range([svgMargin, innerHeight - svgMargin])

    return linearScaleY(lat)
  }

  const calcPath = (ap, i) => {
    let cp1 = {}, cp2 = {}
    let startX, endX, distanceBetweenX
    let startY, endY, distanceBetweenY
    let bendX = 30
    let bendY = 60
    let cpStartThreshX = .25, cpEndThreshX = .75
    let cpStartThreshY = .25, cpEndThreshY = .75

    startX = getX(ap.longitude)
    endX = getX(origin.longitude)
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
                      cx={getX(ap.longitude)}
                      cy={getY(ap.latitude)}
                      fill={destinationDotColor}></circle>
                    <text
                      id={`destination-${ap.code}-label`}
                      ref={labelsRef.current[labelCount++]}
                      x={
                          getX(ap.longitude) + (
                            labelPositions && labelPositions[ap.code]
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

                            :
                              document.getElementById(`destination-${ap.code}-label`)
                              ? -(document.getElementById(`destination-${ap.code}-label`).getBBox().width * .5)
                              : -((ap.code + ap.city + ap.region) * .5)
                          )
                        }
                      y={
                        getY(ap.latitude) + (
                          labelPositions && labelPositions[ap.code]
                          ?
                            labelPositions[ap.code].position == 'right'
                            ? 3
                            :
                              labelPositions[ap.code].position == 'left'
                              ? 3
                              :
                                labelPositions[ap.code].position == 'bottom'
                                ? 16
                                :
                                  labelPositions[ap.code].position == 'top'
                                  ? -10
                                  : 0

                          : -10
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
                                  : `${ap.city},
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
                          getX(ap.longitude) + (
                            labelPositions && labelPositions[ap.code]
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

                            :
                              document.getElementById(`destination-${ap.code}-label`)
                              ? -(document.getElementById(`destination-${ap.code}-label`).getBBox().width * .5)
                              : -((ap.code + ap.city + ap.region) * .5)
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

                          : -19
                        )
                      }
                      width={
                        document.getElementById(`destination-${ap.code}-label`)
                        ?
                          document.getElementById(`destination-${ap.code}-label`).getBBox().width
                        :
                          100
                      }
                      height={
                        document.getElementById(`destination-${ap.code}-label`)
                        ?
                          document.getElementById(`destination-${ap.code}-label`).getBBox().height
                        :
                          10
                      }
                      fill='#fff'></rect>
                      <text
                        id={`destination-${ap.code}-label-double`}
                        x={
                            getX(ap.longitude) + (
                              labelPositions && labelPositions[ap.code]
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

                              :
                                document.getElementById(`destination-${ap.code}-label`)
                                ? -(document.getElementById(`destination-${ap.code}-label`).getBBox().width * .5)
                                : -((ap.code + ap.city + ap.region) * .5)
                            )
                          }
                        y={
                          getY(ap.latitude) + (
                            labelPositions && labelPositions[ap.code]
                            ?
                              labelPositions[ap.code].position == 'right'
                              ? 3
                              :
                                labelPositions[ap.code].position == 'left'
                                ? 3
                                :
                                  labelPositions[ap.code].position == 'bottom'
                                  ? 16
                                  :
                                    labelPositions[ap.code].position == 'top'
                                    ? -10
                                    : 0

                            : -10
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
                                    : `${ap.city},
                                       ${ap.code}`
                            : `${ap.city},
                               ${ap.code}`
                          }
                      </text>
                      <rect
                        style={{ cursor: 'pointer' }}
                        x={getX(ap.longitude) - 7}
                        y={getY(ap.latitude) - 7}
                        width='14'
                        height='14'
                        fill='rgba(0,0,0,0)'
                        opacity='0'
                        onClick={() => {
                        setContextMenuProps({
                          title: ap.code
                        })
                        setContextMenuPosition({ x: getX(ap.longitude)+20, y: getY(ap.latitude)-100 })
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
                <circle
                  r={originDotSize}
                  cx={getX(origin.longitude)}
                  cy={getY(origin.latitude)}
                  fill={originDotColor}></circle>
                <circle
                  r={originCircleSize}
                  cx={getX(origin.longitude)}
                  cy={getY(origin.latitude)}
                  fill='none'
                  stroke={originCircleColor}></circle>
                <text
                  id={`origin-${origin.code}-label`}
                  ref={labelsRef.current[labelCount++]}
                  x={
                      getX(origin.longitude) + (
                        labelPositions && labelPositions[origin.code]
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

                        :
                          document.getElementById(`origin-${origin.code}-label`)
                          ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().width * .5)
                          : -((origin.code + origin.city + origin.region) * .5)
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

                      : -10
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
                              : `${origin.city},
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
                      getX(origin.longitude) + (
                        labelPositions && labelPositions[origin.code]
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

                        :
                          document.getElementById(`origin-${origin.code}-label`)
                          ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().width * .5)
                          : -((origin.code + origin.city + origin.region) * .5)
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

                      : -19
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
                        getX(origin.longitude) + (
                          labelPositions && labelPositions[origin.code]
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

                          :
                            document.getElementById(`origin-${origin.code}-label`)
                            ? -(document.getElementById(`origin-${origin.code}-label`).getBBox().width * .5)
                            : -((origin.code + origin.city + origin.region) * .5)
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

                        : -10
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
                                : `${origin.city},
                                   ${origin.code}`
                        : `${origin.city},
                           ${origin.code}`
                      }
                  </text>
                  <rect
                    style={{ cursor: 'pointer' }}
                    x={getX(origin.longitude) - 7}
                    y={getY(origin.latitude) - 7}
                    width='14'
                    height='14'
                    fill='rgba(0,0,0,0)'
                    opacity='0'
                    onClick={() => {
                    setContextMenuProps({
                      title: origin.code
                    })
                    setContextMenuPosition({ x: getX(origin.longitude)+20, y: getY(origin.latitude)-100 })
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
        <CSSTransition
          unmountOnExit
          in={showContextMenu}
          timeout={300}
          classNames='alert'>
              <div
              className='context-menu-container'
              style={{
                transform: `translateX(${contextMenuPosition.x+'px'}) translateY(${contextMenuPosition.y+'px'})`,
              }}>
              <div
                onClick={() => setShowContextMenu(false)}
                style={{
                  position: 'absolute',
                  top: 0, right: '4px',
                  cursor: 'pointer',
                }}>
                &#10006;
              </div>
              <div className='context-menu-title'>
                {contextMenuProps.title}: Context Menu
              </div>
              <div
                className='context-menu-item-list'>
                <div className='context-menu-label-position-type-title'>Set Label Position</div>
                <div className='context-menu-label-position-type-option' onClick={
                  () => {
                    setLabelPositions({
                      ...labelPositions,
                      [contextMenuProps.title]: {
                        position: 'top'
                      }
                    })
                  }
                }>Top</div>
              <div className='context-menu-label-position-type-option' onClick={
                  () => {
                    setLabelPositions({
                      ...labelPositions,
                      [contextMenuProps.title]: {
                        position: 'right'
                      }
                    })
                  }
                }>Right</div>
              <div className='context-menu-label-position-type-option' onClick={
                  () => {
                    setLabelPositions({
                      ...labelPositions,
                      [contextMenuProps.title]: {
                        position: 'bottom'
                      }
                    })
                  }
                }>Bottom</div>
              <div className='context-menu-label-position-type-option' onClick={
                  () => {
                    setLabelPositions({
                      ...labelPositions,
                      [contextMenuProps.title]: {
                        position: 'left'
                      }
                    })
                  }
                }>Left</div>
              <div className='context-menu-label-display-type-title'>Set Label Display Type</div>
              <div className='context-menu-label-display-type-option' onClick={
                  () => {
                    setLabelDisplayTypes({
                      ...labelDisplayTypes,
                      [contextMenuProps.title]: {
                        displayType: 'full'
                      }
                    })
                  }
                }>Full</div>
              <div className='context-menu-label-display-type-option' onClick={
                  () => {
                    setLabelDisplayTypes({
                      ...labelDisplayTypes,
                      [contextMenuProps.title]: {
                        displayType: 'region'
                      }
                    })
                  }
                }>Region</div>
              <div className='context-menu-label-display-type-option' onClick={
                  () => {
                    setLabelDisplayTypes({
                      ...labelDisplayTypes,
                      [contextMenuProps.title]: {
                        displayType: 'city'
                      }
                    })
                  }
                }>City</div>
              <div className='context-menu-label-display-type-option' onClick={
                  () => {
                    setLabelDisplayTypes({
                      ...labelDisplayTypes,
                      [contextMenuProps.title]: {
                        displayType: 'code'
                      }
                    })
                  }
                }>Code</div>
              </div>
            </div>
        </CSSTransition>
      </div>
    </div>
  </>)

}

export default GenerateSpidermap
