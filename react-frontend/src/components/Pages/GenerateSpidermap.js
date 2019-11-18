import * as d3 from 'd3'
import './generate-map.scss'
import url from '../../url'
import { getUser } from '../../sessionStore'
import React, { useState, useEffect, useRef, createRef, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import mapSettings from '../../mapSettings.config'

const GenerateSpidermap = ({ ...props }) => {

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

  const origin = useSelector(state => state.selectedOriginSpidermap)

  const destinations = useSelector(state => state.selectedDestinationsSpidermap)

  const pathsRef = useRef(destinations.map(() => createRef()))

  const labelsRef = useRef(destinations.concat(origin).map(() => createRef()))

  useEffect(() => {
    pathsRef.current.forEach(path => console.log(path))
    labelsRef.current.forEach(label => console.log(label))
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
                     .range([svgMargin, svgArea.w - svgMargin])

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
                     .range([svgMargin, svgArea.h - svgMargin])

    return linearScaleY(lat)
  }

  const calcPath = (ap, i) => {
    let cp1 = {}, cp2 = {}
    let startX, endX, distanceBetweenX
    let startY, endY, distanceBetweenY
    let bendX = 20
    let bendY = 40
    let cpStartThreshX = .25, cpEndThreshX = .75
    let cpStartThreshY = .25, cpEndThreshY = .75

    startX = getX(ap.longitude)
    endX = getX(origin.longitude)
    distanceBetweenX = endX - startX
    cp1.x = startX + (distanceBetweenX * cpStartThreshX)
    cp2.x = startX + (distanceBetweenX * cpEndThreshX)
    if (startX > endX) { cp1.x += bendX; cp2.x += bendX }
    else { cp1.x -= bendX; cp2.x -= bendX }

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
          stroke='#000'
          fill='none'></path>
      </g>
    )

  }

  return (<>
    <div>
      <svg className='' width={svgArea.w} height={svgArea.h} style={{ backgroundColor: svgBgColor }}>
        {
          origin
          ?
            (<>
              <g>
                <circle r={destinationDotSize * 2}
                        cx={getX(origin.longitude)}
                        cy={getY(origin.latitude)}
                        fill='#FF0000'></circle>
                <circle r={originCircleSize}
                        cx={getX(origin.longitude)}
                        cy={getY(origin.latitude)}
                        fill='none'
                        stroke='#FF0000'></circle>
                <text id={`origin-${origin.code}-label`}
                      ref={labelsRef.current[labelCount++]}
                      x={getX(origin.longitude) - parseInt(originLabelFontSize)}
                      y={getY(origin.latitude) - (parseInt(originLabelFontSize) * 1.25)}
                      fontSize={originLabelFontSize}>
                  {origin.code}
                </text>
              </g>
            </>)
          : null
        }
        {
          destinations
          ?
            destinations.map((ap, i) => (
                <Fragment key={ap.code}>
                  <g>
                    <circle r={destinationDotSize}
                            cx={getX(ap.longitude)}
                            cy={getY(ap.latitude)}
                            fill='#000'></circle>
                    <text id={`destination-${ap.code}-label`}
                          ref={labelsRef.current[labelCount++]}
                          x={getX(ap.longitude) - parseInt(destinationLabelFontSize)}
                          y={getY(ap.latitude) - (parseInt(destinationLabelFontSize) * 1.25)}
                          fontSize={destinationLabelFontSize}>
                      {ap.code}
                    </text>
                  </g>
                  {calcPath(ap, i)}
                </Fragment>
            ))
          : null
        }
      </svg>
    </div>
  </>)

}

export default GenerateSpidermap