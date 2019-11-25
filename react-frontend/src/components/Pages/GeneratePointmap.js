import * as d3 from 'd3'
import './generate-map.scss'
import url from '../../url'
import { getUser } from '../../sessionStore'
import React, { useState, useEffect, useRef, createRef, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import mapSettings from '../../mapSettings.config'

const GeneratePointmap = ({ ...props }) => {

  let {
    svgArea, svgBgColor, svgMargin,
    originCircleSize, originLabelFontSize,
    destinationLabelFontSize, destinationDotSize
  } = mapSettings
  let linearScaleX, linearScaleY
  let lats = [], longs = []
  let pathCount = -1,
      labelCount = -1
  let labelAdjustX = 2,
      labelAdjustY = 2

  const origins = useSelector(state => state.selectedOriginsPointmap)

  const destinations = useSelector(state => state.selectedDestinationsPointmap)

  let destArr = []

  const pathsRef = useRef(destArr.map(() => createRef()))

  const labelsRef = origins ? useRef(origins.concat(destArr).map(() => createRef())) : null

  const [moveXAmt, setMoveXAmt] = useState({})

  const [moveYAmt, setMoveYAmt] = useState({})

  useEffect(() => {
    if (origins == null) props.history.push('/pointmap')
    else {
      Object.keys(destinations).forEach(origin => destArr = destArr.concat(destinations[origin]))
      pathsRef.current.forEach(path => console.log(path))
      labelsRef.current.forEach(label => console.log(label))
      areLabelsTouchingPaths() //?
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
                     .range([svgMargin, svgArea.w - svgMargin])

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
                     .range([svgMargin, svgArea.h - svgMargin])

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
          stroke='#000'
          fill='none'></path>
      </g>
    )

  }

  const moveX = (code, type) => {
    if (moveXAmt[code] != null) {
      setMoveXAmt({
        ...moveXAmt,
        [code]: type == 'plus' ? moveXAmt[code] + labelAdjustX : moveXAmt[code] - labelAdjustX
      })
    } else {
      setMoveXAmt({
        ...moveXAmt,
        [code]: type == 'plus' ? labelAdjustX : -labelAdjustX
      })
    }
  }

  const moveY = (code, type) => {
    if (moveYAmt[code] != null) {
      setMoveYAmt({
        ...moveYAmt,
        [code]: type == 'plus' ? moveYAmt[code] + labelAdjustY : moveYAmt[code] - labelAdjustY
      })
    } else {
      setMoveYAmt({
        ...moveYAmt,
        [code]: type == 'plus' ? labelAdjustY : -labelAdjustY
      })
    }
  }

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

  return (<>
    <div className='white-backing'></div>
    <div>
      <svg
        className=''
        width={ svgArea.w }
        height={ svgArea.h }
        style={{
          border: '1px solid #ccc',
          backgroundColor: svgBgColor
        }}>
        {
          origins
          ?
            origins.map(ap => (
              <Fragment key={ap.code}>
                <g>
                  <circle r={destinationDotSize * 2}
                          cx={getX(ap.longitude)}
                          cy={getY(ap.latitude)}
                          fill='#FF0000'></circle>
                  <circle r={originCircleSize}
                          cx={getX(ap.longitude)}
                          cy={getY(ap.latitude)}
                          fill='none'
                          stroke='#FF0000'></circle>
                  <text id={`origin-${ap.code}-label`}
                        ref={labelsRef.current[labelCount++]}
                        x={getX(ap.longitude) - parseInt(originLabelFontSize) + (moveXAmt[ap.code] ? moveXAmt[ap.code] : 0)}
                        y={getY(ap.latitude) - (parseInt(originLabelFontSize) * 1.25) + (moveYAmt[ap.code] ? moveYAmt[ap.code] : 0)}
                        fontSize={originLabelFontSize}>
                    {ap.city}, {ap.region} - {ap.code}
                  </text>
                </g>
              </Fragment>
            ))
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
                      <circle r={destinationDotSize}
                              cx={getX(ap.longitude)}
                              cy={getY(ap.latitude)}
                              fill='#000'></circle>
                      <text id={`destination-${ap.code}-label`}
                            ref={labelsRef.current[labelCount++]}
                            x={getX(ap.longitude) - parseInt(destinationLabelFontSize) + (moveXAmt[ap.code] ? moveXAmt[ap.code] : 0)}
                            y={getY(ap.latitude) - (parseInt(destinationLabelFontSize) * 1.25) + (moveYAmt[ap.code] ? moveYAmt[ap.code] : 0)}
                            fontSize={destinationLabelFontSize}>
                        {ap.city}, {ap.region} - {ap.code}
                      </text>
                    </g>
                    {calcPath(originObj, origin, ap, i)}
                  </Fragment>
              ))
            })
          : null
        }
      </svg>
      {/*<div>Controls</div>*/}
      {/*
        destArr.concat(origins).map((ap, i) => (<Fragment key={`${ap.code}-buttons-${i}`}>
            <div>Label for {ap.code}:</div>
            <button onClick={() => moveY(ap.code, 'minus')}>up</button><br/>
            <button onClick={() => moveX(ap.code, 'minus')}>left</button><button onClick={() => moveX(ap.code, 'plus')}>right</button><br/>
            <button onClick={() => moveY(ap.code, 'plus')}>down</button>
            <br/><br/>
          </Fragment>))
      */}
    </div>
  </>)

}

export default withRouter(GeneratePointmap)
