import * as d3 from 'd3'
import random from 'random'
import axios from 'axios'
import _ from 'lodash'
import './generate-pointmap.scss'
import url from '../../url'
import { getUser } from '../../sessionStore'
import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const GeneratePointmap = ({ ...props }) => {

  let svgArea = { w:1000, h:800 }
  let svgBgColor = '#ccc'
  let svgMargin = svgArea.w/5
  let originCircleSize = 8
  let originLabelFontSize = '8px'
  let destinationLabelFontSize = '8px'
  let destinationDotSize = 2 // location circle/dot size
  let linearScaleX, linearScaleY
  let lats = [], longs = []

  const origins = useSelector(state => state.selectedOriginsPointmap)

  const destinations = useSelector(state => state.selectedDestinationsPointmap)

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

  // const calcPaths = ap => {
  //   return `
  //     M ${origins.indexOf(ap).ap.longitude},${origins.indexOf(ap).ap.latitude}
  //     L ${ap.longitude}},${ap.latitude}
  //   `
  // }

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

                return destinations[origin].map(ap => (
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
                    <path
                      d={
                          `M ${getX(originObj[origin].longitude)},${getY(originObj[origin].latitude)}
                           L ${getX(ap.longitude)},${getY(ap.latitude)}`
                         }
                      stroke='#000'></path>
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
