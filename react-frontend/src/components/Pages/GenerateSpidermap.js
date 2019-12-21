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
    setTimeout(() => setShowContextMenu(false), 5)
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
      // hack to re-render svg data
      setShowContextMenu(true)
      setTimeout(() => setShowContextMenu(false), 5)
      // load timezone data
      if (!timezoneLatLongs) {
        axios.get('/timezones', { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
             .then(result => {
               console.log(result.data[0].all)
               dispatch({ type: SET_TIMEZONE_LATLONGS, payload: result.data[0].all })
               // hack to re-render svg data
               setShowContextMenu(true)
               setTimeout(() => setShowContextMenu(false), 5)
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
    if (!longs.includes(long)) {
      let arr = destinations.map(ap => timezoneLatLongs[ap.timezone].longitude)
      longs = longs.concat(arr)
      longs = longs.concat(timezoneLatLongs[origin.timezone].longitude)
      longs.sort((a, b) => a - b)
    }
    linearScaleX = d3.scaleLinear()
                     .domain([longs[0], longs[longs.length-1]])
                     .range([(svgMargin/2), ((innerHeight * 1.15)/2)])

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
                     .range([(svgMargin/2), ((innerHeight - svgMargin)/2)])
    // the below evenly spaces Y values according to timezone
    return linearScaleY(((lats.reduce((a, b) => a + b) / lats.length)) * lats.indexOf(lat))
  }

  let ringOne = `
    M ${calcCenter().x}, ${calcCenter().y}
    m -${getGraphDimensions().w * .05}, 0
    a ${getGraphDimensions().w * .05},${getGraphDimensions().w * .05} 0 1,0 ${getGraphDimensions().w * .1},0
    a ${getGraphDimensions().w * .05},${getGraphDimensions().w * .05} 0 1,0 -${getGraphDimensions().w * .1},0
  `
  let ringTwo = `
    M ${calcCenter().x}, ${calcCenter().y}
    m -${getGraphDimensions().w * .1}, 0
    a ${getGraphDimensions().w * .1},${getGraphDimensions().w * .1} 0 1,0 ${getGraphDimensions().w * .2},0
    a ${getGraphDimensions().w * .1},${getGraphDimensions().w * .1} 0 1,0 -${getGraphDimensions().w * .2},0
  `
  let ringThree = `
    M ${calcCenter().x}, ${calcCenter().y}
    m -${getGraphDimensions().w * .15}, 0
    a ${getGraphDimensions().w * .15},${getGraphDimensions().w * .15} 0 1,0 ${getGraphDimensions().w * .3},0
    a ${getGraphDimensions().w * .15},${getGraphDimensions().w * .15} 0 1,0 -${getGraphDimensions().w * .3},0
  `
  let ringFour = `
  M ${calcCenter().x}, ${calcCenter().y}
  m -${getGraphDimensions().w * .2}, 0
  a ${getGraphDimensions().w * .2},${getGraphDimensions().w * .2} 0 1,0 ${getGraphDimensions().w * .4},0
  a ${getGraphDimensions().w * .2},${getGraphDimensions().w * .2} 0 1,0 -${getGraphDimensions().w * .4},0
  `
  let ringFive = `
    M ${calcCenter().x}, ${calcCenter().y}
    m -${getGraphDimensions().w * .25}, 0
    a ${getGraphDimensions().w * .25},${getGraphDimensions().w * .25} 0 1,0 ${getGraphDimensions().w * .5},0
    a ${getGraphDimensions().w * .25},${getGraphDimensions().w * .25} 0 1,0 -${getGraphDimensions().w * .5},0
  `
  let ringSix = `
    M ${calcCenter().x}, ${calcCenter().y}
    m -${getGraphDimensions().w * .3}, 0
    a ${getGraphDimensions().w * .3},${getGraphDimensions().w * .3} 0 1,0 ${getGraphDimensions().w * .6},0
    a ${getGraphDimensions().w * .3},${getGraphDimensions().w * .3} 0 1,0 -${getGraphDimensions().w * .6},0
  `
  let ringSeven = `
    M ${calcCenter().x}, ${calcCenter().y}
    m -${getGraphDimensions().w * .35}, 0
    a ${getGraphDimensions().w * .35},${getGraphDimensions().w * .35} 0 1,0 ${getGraphDimensions().w * .7},0
    a ${getGraphDimensions().w * .35},${getGraphDimensions().w * .35} 0 1,0 -${getGraphDimensions().w * .7},0
  `

  const getRingBasedOnLat = (origin, ap) => {
    if ((origin.longitude - ap.longitude) < -25 && (origin.longitude - ap.longitude) > -300) {
      return ringSeven
    }
    if ((origin.longitude - ap.longitude) < -20 && (origin.longitude - ap.longitude) > -25) {
      return ringSix
    }
    if ((origin.longitude - ap.longitude) < -15 && (origin.longitude - ap.longitude) > -20) {
      return ringFive
    }
    if ((origin.longitude - ap.longitude) < -10 && (origin.longitude - ap.longitude) > -15) {
      return ringFour
    }
    if ((origin.longitude - ap.longitude) < -5 && (origin.longitude - ap.longitude) > -10) {
      return ringThree
    }
    if ((origin.longitude - ap.longitude) < -2 && (origin.longitude - ap.longitude) > -5) {
      return ringTwo
    }
    if ((origin.longitude - ap.longitude) < 0 && (origin.longitude - ap.longitude) > -2) {
      return ringOne
    }
    if ((origin.longitude - ap.longitude) > 0 && (origin.longitude - ap.longitude) < 2) {
      return ringOne
    }
    if ((origin.longitude - ap.longitude) > 2 && (origin.longitude - ap.longitude) < 5) {
      return ringTwo
    }
    if ((origin.longitude - ap.longitude) > 5 && (origin.longitude - ap.longitude) < 10) {
      return ringThree
    }
    if ((origin.longitude - ap.longitude) > 10 && (origin.longitude - ap.longitude) < 15) {
      return ringFour
    }
    if ((origin.longitude - ap.longitude) > 15 && (origin.longitude - ap.longitude) < 20) {
      return ringFive
    }
    if ((origin.longitude - ap.longitude) > 20 && (origin.longitude - ap.longitude) < 25) {
      return ringSix
    }
    if ((origin.longitude - ap.longitude) > 25 && (origin.longitude - ap.longitude) < 300) {
      return ringSeven
    }
  }

  const calcPath = (ap, i) => {
    let get_x = getX(ap.longitude)
    let center = calcCenter()
    let ring = getRingBasedOnLat(origin, ap)
    let cp1 = {}, cp2 = {}
    let startX, endX, distanceBetweenX
    let startY, endY, distanceBetweenY
    let cpStartThreshX = .3, cpEndThreshX = .7
    let cpStartThreshY = .3, cpEndThreshY = .7
    let bendX = (
      ring == ringOne
      ? 5
      :
        ring == ringTwo
        ? 10
        :
          ring == ringThree
          ? 15
          : 20
      )
    let bendY = (
      ring == ringOne
      ? 15
      :
        ring == ringTwo
        ? 20
        :
          ring == ringThree
          ? 25
          : 30
      )

    // startX = calcCenter().x + getX(ap.longitude)
    startX = (
      ap.longitude < origin.longitude
      ? ((center.x + get_x) * -10)
      : ((center.x + get_x) * 10)
    )
    endX = center.x
    startY = (
      ap.latitude < origin.latitude
      ? ((i * (innerHeight/destinations.length)) * 20)
      : ((i * (innerHeight/destinations.length)) * -20)
    )
    endY = center.y

    // debug circles
    // <circle fill='#0000ff' r='2' cx={cp1.x} cy={cp1.y}></circle>
    // <circle fill='#e100ff' r='2' cx={cp2.x} cy={cp2.y}></circle>
    pathCount++

    let linearPath = `
      M ${startX},${startY}
      L ${endX}, ${endY}
    `
    let point = intersect(linearPath, ring)[0]
    
    distanceBetweenX = point.x - center.x
    cp1.x = center.x + (distanceBetweenX * cpStartThreshX)
    cp2.x = center.x + (distanceBetweenX * cpEndThreshX)
    if (center.x > point.x) { cp1.x += bendX; cp2.x += bendX }
    else { cp1.x -= bendX; cp2.x -= bendX }

    distanceBetweenY = point.y - center.y
    cp1.y = center.y + (distanceBetweenY * cpStartThreshY) - bendY
    cp2.y = center.y + (distanceBetweenY * cpEndThreshY) - bendY
    // if (calcCenter().y > point.y) { cp1.y += bendY; cp2.y += bendY }
    // else { cp1.y -= bendY; cp2.y -= bendY }

    console.log(point)
    points[ap.code] = point

    return (
      <g>
        <path
          id={`${origin.code}-to-${ap.code}-path`}
          ref={ pathsRef.current[pathCount] }
          d={
            `
              M ${center.x},${center.y}
              C ${cp1.x},${cp1.y}
                ${cp2.x},${cp2.y}
                ${point.x},${point.y}
            `
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
            ? destinations.map((ap, i) => (<Fragment key={'path'+i}>{calcPath(ap, i)}</Fragment>)) : null
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
                    onClick={() => {
                      setContextMenuProps({
                        title: ap.code
                      })
                      setContextMenuPosition({ x: points[ap.code].x + 20, y: points[ap.code].y - 100 })
                      setShowContextMenu(true)
                    }}
                    r={destinationDotSize}
                    cx={ points[ap.code].x }
                    cy={ points[ap.code].y }
                    fill={destinationDotColor}></circle>
                  <text
                    id={`destination-${ap.code}-label`}
                    ref={labelsRef.current[labelCount++]}
                    x={
                        points[ap.code].x + (
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
                      points[ap.code].y + (
                        labelPositions && labelPositions[ap.code]
                        ?
                          labelPositions[ap.code].position == 'right'
                          ? 3
                          :
                            labelPositions[ap.code].position == 'left'
                            ? 3
                            :
                              labelPositions[ap.code].position == 'bottom'
                              ? 15
                              :
                                labelPositions[ap.code].position == 'top'
                                ? -9
                                : 0

                        : 3
                      )
                    }
                    style={{
                      textAlign: 'center',
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
                    id={`destination-${ap.code}-white-box-under-label`}
                    ref={whiteBoxUnderLabelsRef.current[whiteBoxUnderLabelCount++]}
                    onClick={() => {
                      setContextMenuProps({
                        title: ap.code
                      })
                      setContextMenuPosition({ x: points[ap.code].x + 20, y: points[ap.code].y - 100 })
                      setShowContextMenu(true)
                    }}
                    style={{
                      cursor: 'pointer',
                    }}
                    x={
                        points[ap.code].x + (
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
                      points[ap.code].y + (
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
                                ? -16
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
                      : 12
                    }
                    fill='#fff'>
                    </rect>
                    <text
                      id={`destination-${ap.code}-label-double`}
                      onClick={() => {
                        setContextMenuProps({
                          title: ap.code
                        })
                        setContextMenuPosition({ x: points[ap.code].x + 20, y: points[ap.code].y - 100 })
                        setShowContextMenu(true)
                      }}
                      x={
                          points[ap.code].x + (
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
                        points[ap.code].y + (
                          labelPositions && labelPositions[ap.code]
                          ?
                            labelPositions[ap.code].position == 'right'
                            ? 3
                            :
                              labelPositions[ap.code].position == 'left'
                              ? 3
                              :
                                labelPositions[ap.code].position == 'bottom'
                                ? 15
                                :
                                  labelPositions[ap.code].position == 'top'
                                  ? -9
                                  : 0

                          : 3
                        )
                      }
                      style={{
                        textAlign: 'center', cursor: 'pointer',
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
                    {/*<rect
                      style={{ cursor: 'pointer' }}
                      x={ points[ap.code].x - 7 }
                      y={ points[ap.code].y - 7 }
                      width='14'
                      height='14'
                      fill='rgba(0,0,0,0)'
                      opacity='0'
                      onClick={() => {
                      setContextMenuProps({
                        title: ap.code
                      })
                      setContextMenuPosition({ x: points[ap.code].x + 20, y: points[ap.code].y - 100 })
                      setShowContextMenu(true)
                    }}>
                    </rect>*/}
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
              <circle r={originCircleSize}
                      cx={calcCenter().x}
                      cy={calcCenter().y}
                      fill='none'
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
                            calcCenter().y + (
                              labelPositions && labelPositions[origin.code]
                              ?
                                labelPositions[origin.code].position == 'right'
                                ? 3
                                :
                                  labelPositions[origin.code].position == 'left'
                                  ? 3
                                  :
                                    labelPositions[origin.code].position == 'bottom'
                                    ? 15
                                    :
                                      labelPositions[origin.code].position == 'top'
                                      ? -9
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
                              calcCenter().x + (
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
                            calcCenter().y + (
                              labelPositions && labelPositions[origin.code]
                              ?
                                labelPositions[origin.code].position == 'right'
                                ? -5
                                :
                                  labelPositions[origin.code].position == 'left'
                                  ? -5
                                  :
                                    labelPositions[origin.code].position == 'bottom'
                                    ? 8
                                    :
                                      labelPositions[origin.code].position == 'top'
                                      ? -17
                                      : 0

                              : -5
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
                              12
                          }
                          fill='#fff'></rect>
                          <text
                            id={`origin-${origin.code}-label-double`}
                            x={
                                calcCenter().x + (
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
                              calcCenter().y + (
                                labelPositions && labelPositions[origin.code]
                                ?
                                  labelPositions[origin.code].position == 'right'
                                  ? 3
                                  :
                                    labelPositions[origin.code].position == 'left'
                                    ? 3
                                    :
                                      labelPositions[origin.code].position == 'bottom'
                                      ? 15
                                      :
                                        labelPositions[origin.code].position == 'top'
                                        ? -9
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
                          }}></rect>
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
