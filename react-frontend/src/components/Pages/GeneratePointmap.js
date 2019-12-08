import * as d3 from 'd3'
import { TweenLite } from 'gsap'
import './generate-map.scss'
import url from '../../url'
import { getUser } from '../../sessionStore'
import { withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import React, { useState, useEffect, useRef, createRef, Fragment } from 'react'
import UserLeftSidePanel from '../Views/UserLeftSidePanel'
import DownloadImagePanel from '../Views/DownloadImagePanel'
// import DownloadingFile_Modal from '../Modals/DownloadingFile_Modal'
import mapSettings from '../../mapSettings.config'

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

  // const [moveXAmt, setMoveXAmt] = useState({})

  // const [moveYAmt, setMoveYAmt] = useState({})

  const [listedLegalLines, setListedLegalLines] = useState([])

  const [showContextMenu, setShowContextMenu] = useState(false)

  const [contextMenuPosition, setContextMenuPosition] = useState({})

  const [contextMenuProps, setContextMenuProps] = useState({})

  const [labelPositions, setLabelPositions] = useState({})

  const [labelDisplayTypes, setLabelDisplayTypes] = useState({})

  useEffect(() => {
    if (origins == null) props.history.push('/pointmap')
    else {
      pathsRef.current.forEach(path => console.log(path))
      labelsRef.current.forEach(label => console.log(label))
      areLabelsTouchingOtherLabels() //?
      let legal = []
      Object.keys(destinations).forEach((arr, i) => {
        legal = legal.concat(destinations[arr].map(item => { if (item && item.legal) return item.legal }))
      })
      legal = legal.concat(origins.map(item => { if (item && item.legal) return item.legal }))
      legal = legal.filter((item, i) => i == legal.indexOf(item))
      console.log(legal)
      setListedLegalLines(legal)
    }
  }, [])

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

  // const labelPosition = (code, type) => {
  //   if (labelPosition[code] != null) {
  //     setLabelPosition({
  //       ...labelPosition,
  //       [code]: type == 'plus' ? moveXAmt[code] + labelAdjustX : moveXAmt[code] - labelAdjustX
  //     })
  //   } else {
  //     setMoveXAmt({
  //       ...moveXAmt,
  //       [code]: type == 'plus' ? labelAdjustX : -labelAdjustX
  //     })
  //   }
  // }
  //
  // const moveY = (code, type) => {
  //   if (moveYAmt[code] != null) {
  //     setMoveYAmt({
  //       ...moveYAmt,
  //       [code]: type == 'plus' ? moveYAmt[code] + labelAdjustY : moveYAmt[code] - labelAdjustY
  //     })
  //   } else {
  //     setMoveYAmt({
  //       ...moveYAmt,
  //       [code]: type == 'plus' ? labelAdjustY : -labelAdjustY
  //     })
  //   }
  // }

  const areLabelsTouchingPaths = () => {
    for(let i = 0; i < labelsRef.current.length; i++){
      if (labelsRef.current[i] && labelsRef.current[i].current) {
        let label = labelsRef.current[i].current,
            label_rect = label.getBoundingClientRect()
        for(let j = 0; j < pathsRef.current.length; j++ ){
          let path = pathsRef.current[j].current
          let path_rect = path.getBoundingClientRect()
          if(!( path_rect.left > label_rect.right
              || path_rect.right < label_rect.left
              || path_rect.top > label_rect.bottom
              || path_rect.bottom < label_rect.top)) {
            // move text over
            console.log(`${path.id} and ${label.id} bounding boxes intersect`)
            // get all points within label boundingBox
            console.log(label_rect.left, label_rect.right)
            console.log(label_rect.top, label_rect.bottom)
          }
        }
      }
    }
  }

  const areLabelsTouchingOtherLabels = () => {
    for(let i = 0; i < labelsRef.current.length; i++){
      if (labelsRef.current[i] && labelsRef.current[i].current) {
        let label = labelsRef.current[i].current,
            label_rect = label.getBoundingClientRect()
        for(let j = 0; j < labelsRef.current.length; j++ ){
          let label2 = labelsRef.current[j].current
          let label_rect2
          // let amt = 0
          if (label2 && label != label2) {
            label_rect2 = label2.getBoundingClientRect()
            if(!( label_rect2.left > label_rect.right
                || label_rect2.right < label_rect.left
                || label_rect2.top > label_rect.bottom
                || label_rect2.bottom < label_rect.top)) {
              // move text over
              console.log(`${label2.id} and ${label.id} bounding boxes intersect`)
              // amt += 10
              // TweenLite.set(`#${label2.id}`, { y: amt })
              // get all points within label boundingBox
              console.log(label_rect.left, label_rect.right)
              console.log(label_rect.top, label_rect.bottom)
            }
          }
        }
      }
    }
  }

  return (<>
    {/*
      downloadingPDF
      ? <DownloadingFile_Modal/>
      : null
    */}
    { downloadingPDF ? <div className='white-backing'></div> : null }
    <div className='row'>
      <UserLeftSidePanel/>
      <DownloadImagePanel type='pointmap' label='Point-to-Point Map'/>
      <div
        id='map-content'
        className='col-med pdf-content'
        style={{
          transform: downloadingPDF ? `scale(${550/innerHeight})` : '',
          height:'100vh',
          backgroundColor: '#fff',
        }}>
        <svg
          className='svg-map-area'
          width={ (innerHeight * 1.25) }
          height={ innerHeight }
          style={{
            backgroundColor: displayMapBG ? svgBgColor : 'rgba(0, 0, 0, 0)',
            boxShadow: downloadingPDF ? '' : 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
          }}>
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

                  destinations[origin].forEach((ap, i) => {
                    setLabelDisplayTypes[ap.code] = {
                      displayType: 'city'
                    }
                    setLabelPositions[ap.code] = {
                      position: 'top'
                    }
                  })

                  return destinations[origin].map((ap, i) => (
                    <Fragment key={ap.code}>
                      <g>
                        <circle
                          onClick={() => {
                            setContextMenuProps({
                              title: ap.code
                            })
                            setContextMenuPosition({ x: getX(ap.longitude), y: getY(ap.latitude)-100 })
                            setShowContextMenu(true)
                          }}
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
                    <circle
                      onClick={() => {
                        setContextMenuProps({
                          title: ap.code
                        })
                        setContextMenuPosition({ x: getX(ap.longitude), y: getY(ap.latitude)-100 })
                        setShowContextMenu(true)
                      }}
                      r={originDotSize}
                      cx={getX(ap.longitude)}
                      cy={getY(ap.latitude)}
                      fill={originDotColor}></circle>
                    <circle
                      r={originCircleSize}
                      cx={getX(ap.longitude)}
                      cy={getY(ap.latitude)}
                      fill='none'
                      stroke={originCircleColor}></circle>
                    <text
                      id={`origin-${ap.code}-label`}
                      ref={labelsRef.current[labelCount++]}
                      x={
                          getX(ap.longitude) + (
                            labelPositions && labelPositions[ap.code]
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

                            :
                              document.getElementById(`origin-${ap.code}-label`)
                              ? -(document.getElementById(`origin-${ap.code}-label`).getBBox().width * .5)
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
                        textAlign: 'center', pointerEvents: 'none',
                        fontWeight: 'bold'
                      }}
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
                      id={`origin-${ap.code}-white-box-under-label`}
                      ref={whiteBoxUnderLabelsRef.current[whiteBoxUnderLabelCount++]}
                      x={
                          getX(ap.longitude) + (
                            labelPositions && labelPositions[ap.code]
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

                            :
                              document.getElementById(`origin-${ap.code}-label`)
                              ? -(document.getElementById(`origin-${ap.code}-label`).getBBox().width * .5)
                              : -((ap.code + ap.city + ap.region) * .5)
                          )
                        }
                      y={
                        getY(ap.latitude) + (
                          labelPositions && labelPositions[ap.code]
                          ?
                            labelPositions[ap.code].position == 'right'
                            ? -6
                            :
                              labelPositions[ap.code].position == 'left'
                              ? -6
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
                        document.getElementById(`origin-${ap.code}-label`)
                        ?
                          document.getElementById(`origin-${ap.code}-label`).getBBox().width
                        :
                          100
                      }
                      height={
                        document.getElementById(`origin-${ap.code}-label`)
                        ?
                          document.getElementById(`origin-${ap.code}-label`).getBBox().height
                        :
                          10
                      }
                      fill='#fff'></rect>
                      <text
                        id={`origin-${ap.code}-label-double`}
                        x={
                            getX(ap.longitude) + (
                              labelPositions && labelPositions[ap.code]
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

                              :
                                document.getElementById(`origin-${ap.code}-label`)
                                ? -(document.getElementById(`origin-${ap.code}-label`).getBBox().width * .5)
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
                          textAlign: 'center', pointerEvents: 'none',
                          fontWeight: 'bold'
                        }}
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
        {
          showContextMenu
          ?
            (<>
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
                }}>
                &#10006;
              </div>
              <div className='context-menu-title'>
                {contextMenuProps.title}: Context Menu
              </div>
              <div
                style={{
                  fontSize: '.75rem'
                }}
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
          </>) : null
        }
      </div>
    </div>
  </>)

}

export default withRouter(GeneratePointmap)
