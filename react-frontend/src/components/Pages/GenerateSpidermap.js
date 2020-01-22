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

  const circlesRef = useRef(destinations.map(() => createRef()))

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

  const svg_map_area = useRef()

  const leftPanelsRef = useRef()

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
      // pathsRef.current.forEach(path => console.log(path))
      // labelsRef.current.forEach(label => console.log(label))
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
      setTimeout(() => dispatch({ type: RERENDER_HACK, payload: false }), 5)
      // load timezone data
      if (!timezoneLatLongs) {
        axios.get('/timezones', { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
             .then(result => {
               // console.log(result.data[0].all)
               dispatch({ type: SET_TIMEZONE_LATLONGS, payload: result.data[0].all })
               // hack to re-render svg data
               dispatch({ type: RERENDER_HACK, payload: true })
               setTimeout(() => dispatch({ type: RERENDER_HACK, payload: false }), 5)
             })
      }
      // whiteBoxUnderLabelsRef.current.forEach((item, i) => {
      //   const checkClick = () => {
      //     if (document.getElementById(item.current.id)) {
      //       document.getElementById(item.current.id)
      //     } else {
      //       setTimeout(checkClick, 1000)
      //     }
      //   }
      //   if (item.current) checkClick()
      // })
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

    pathCount++

    let angle = 360/destinations.length * pathCount
    let pointY = 50

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
            ? destinations.map((ap, i) => (
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
    : null
  }
  </>)

}

export default GenerateSpidermap
