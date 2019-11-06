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
  let dotSize = 2 // location circle/dot size

  const [airports, setAirports] = useState()

  const [points, setPoints] = useState()

  useEffect(() => {
    init()

  }, [])

  const init = async () => {
    try {
      let result = await axios.get(`${url}/airports/byCode`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
      let filteredResults = result.data.filter(ap => ap.code != 'NRT' && ap.code != 'LHR')
      // adjust JFK/LGA lat longs due to how close they are to each other
      filteredResults.forEach(ap => { if(ap.code == 'LGA') ap.latitude += 1 })
      setAirports(filteredResults)

    } catch (e) { console.log(e) }
  }

  const getX = long => {
    let longs = airports.map(ap => ap.longitude)
    longs.sort((a, b) => a - b)
    let linearScaleX = d3.scaleLinear()
                        .domain([longs[0], longs[longs.length-1]])
                        .range([svgMargin, svgArea.w - svgMargin])

    return linearScaleX(long)
  }

  const getY = lat => {
    let lats = airports.map(ap => ap.latitude)
    lats.sort((a, b) => b - a)
    let linearScaleY = d3.scaleLinear()
                        .domain([lats[0], lats[lats.length-1]])
                        .range([svgMargin, svgArea.h - svgMargin])

    return linearScaleY(lat)
  }

  return (<>
    <div>
      <svg className='' width={svgArea.w} height={svgArea.h} style={{ backgroundColor: svgBgColor }}>
        {
          airports
          ?
            airports.map(ap => (
              <Fragment key={ap.code}>
                <g>
                  <circle r={dotSize}
                          cx={getX(ap.longitude)}
                          cy={getY(ap.latitude)}
                          fill='#000'></circle>
                  <text x={getX(ap.longitude - dotSize)}
                        y={getY(ap.latitude)}
                        fontSize='.5rem'>
                    {ap.code}
                  </text>
                </g>
              </Fragment>
            ))
          : null
        }
      </svg>
    </div>
  </>)

}

export default GeneratePointmap
