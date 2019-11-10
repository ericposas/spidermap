import * as d3 from 'd3'
import random from 'random'
import axios from 'axios'
import _ from 'lodash'
import './generate-pointmap.scss'
import url from '../../url'
import { getUser } from '../../sessionStore'
import React, { useState, useEffect, useRef, createRef, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import mapSettings from '../../mapSettings.config'

const GeneratePointmap = ({ ...props }) => {

  let {
    svgArea, svgBgColor, svgMargin,
    originCircleSize, originLabelFontSize,
    destinationLabelFontSize, destinationDotSize
  } = mapSettings
  let linearScaleX, linearScaleY
  let lats = [], longs = []

  const origins = useSelector(state => state.selectedOriginsPointmap)

  const destinations = useSelector(state => state.selectedDestinationsPointmap)

  let destArr = []
  Object.keys(destinations).forEach(origin => {
    destArr = destArr.concat(destinations[origin])
  })

  const pathsRef = useRef(destArr.map(() => createRef()))

  useEffect(() => {
    pathsRef.current.forEach(path => {
      console.log(path)
    })
  })
  
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

    return (
      <g>
        <path ref={pathsRef.current[i]}
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

  return (<>
    <div>
      <svg className='' width={svgArea.w} height={svgArea.h} style={{ backgroundColor: svgBgColor }}>
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
                  <text x={getX(ap.longitude) - parseInt(originLabelFontSize)}
                        y={getY(ap.latitude) - (parseInt(originLabelFontSize) * 1.25)}
                        fontSize={originLabelFontSize}>
                    {ap.code}
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
                      <text x={getX(ap.longitude) - parseInt(destinationLabelFontSize)}
                            y={getY(ap.latitude) - (parseInt(destinationLabelFontSize) * 1.25)}
                            fontSize={destinationLabelFontSize}>
                        {ap.code}
                      </text>
                    </g>
                    {calcPath(originObj, origin, ap, i)}
                  </Fragment>
              ))
            })
          : null
        }
      </svg>
    </div>
  </>)

}

export default GeneratePointmap
