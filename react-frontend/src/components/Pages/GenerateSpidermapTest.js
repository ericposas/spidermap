import React, { useEffect, useState, useRef, createRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getUser } from '../../sessionStore'
import { SET_ALL_CODES, RERENDER_HACK } from '../../constants/constants'
import intersect from 'path-intersection'
import axios from 'axios'

const GenerateSpidermapTest = ({ ...props }) => {

  let i = 0

  const sortFunction = (a, b) => {
    if (a.latitude < b.latitude) return 1
    if (a.latitude > b.latitude) return -1
    return 0
  }

  const dispatch = useDispatch()

  const selectedOriginSpidermap = useSelector(state => state.selectedOriginSpidermap)

  const selectedDestinationsSpidermap = useSelector(state => state.selectedDestinationsSpidermap.sort(sortFunction))

  const dotRefs = useRef(selectedDestinationsSpidermap.map(() => createRef()))

  const textRefs = useRef(selectedDestinationsSpidermap.map(() => createRef()))

  const pathRefs = useRef(selectedDestinationsSpidermap.map(() => createRef()))

  // const destinationTextRefs = useRef(selectedDestinationsSpidermap.sort(sortFunction).map(() => createRef()))

  // const mapDotRefs = useRef(selectedDestinationsSpidermap.sort(sortFunction).map(() => createRef()))

  const [spidermapCodes, setSpidermapCodes] = useState(null)

  const originTextRef = useRef()

  const svgRef = useRef()

  const rerenderHack = useSelector(state => state.rerenderHack)

  const sortCodesForSpidermap = data => {

    let firstRing =[], secondRing = [], thirdRing = [], fourthRing = [], fifthRing = []

    data.forEach(dest => {
      if ((selectedOriginSpidermap.longitude - dest.longitude) < -20 && (selectedOriginSpidermap.longitude - dest.longitude) > -300) {
        fifthRing.push(dest)
      }
      if ((selectedOriginSpidermap.longitude - dest.longitude) < -12 && (selectedOriginSpidermap.longitude - dest.longitude) > -20) {
        fourthRing.push(dest)
      }
      if ((selectedOriginSpidermap.longitude - dest.longitude) < -5 && (selectedOriginSpidermap.longitude - dest.longitude) > -12) {
        thirdRing.push(dest)
      }
      if ((selectedOriginSpidermap.longitude - dest.longitude) < -2 && (selectedOriginSpidermap.longitude - dest.longitude) > -5) {
        secondRing.push(dest)
      }
      if ((selectedOriginSpidermap.longitude - dest.longitude) < 0 && (selectedOriginSpidermap.longitude - dest.longitude) > -2) {
        firstRing.push(dest)
      }
      if ((selectedOriginSpidermap.longitude - dest.longitude) > 0 && (selectedOriginSpidermap.longitude - dest.longitude) < 2) {
        firstRing.push(dest)
      }
      if ((selectedOriginSpidermap.longitude - dest.longitude) > 2 && (selectedOriginSpidermap.longitude - dest.longitude) < 5) {
        secondRing.push(dest)
      }
      if ((selectedOriginSpidermap.longitude - dest.longitude) > 5 && (selectedOriginSpidermap.longitude - dest.longitude) < 12) {
        thirdRing.push(dest)
      }
      if ((selectedOriginSpidermap.longitude - dest.longitude) > 12 && (selectedOriginSpidermap.longitude - dest.longitude) < 20) {
        fourthRing.push(dest)
      }
      if ((selectedOriginSpidermap.longitude - dest.longitude) > 20 && (selectedOriginSpidermap.longitude - dest.longitude) < 300) {
        fifthRing.push(dest)
      }

    })

    return {
      'five': fifthRing,
      'four': fourthRing,
      'three': thirdRing,
      'two': secondRing,
      'one': firstRing,
    }

  }

  const calcPath = (endX, endY, groupName) => {

    let cp1 = {}, cp2 = {}
    let startX = innerWidth/2, startY = innerWidth/2
    let distanceBetweenX, distanceBetweenY
    let bendX = (
      groupName == 'five'
      ? 50
      :
        groupName == 'four'
        ? 35
        :
          groupName == 'three'
          ? 20
          :
            groupName == 'two'
            ? 15
            :
              groupName == 'one'
              ? 10
              : 0
    )
    let bendY = (
      groupName == 'five'
      ? innerWidth * .04
      :
        groupName == 'four'
        ? innerWidth * .0275
        :
          groupName == 'three'
          ? innerWidth * .015
          :
            groupName == 'two'
            ? innerWidth * .01
            :
              groupName == 'one'
              ? innerWidth * .005
              : innerWidth * .00
    )
    let cpStartThreshX = .25, cpEndThreshX = .75
    let cpStartThreshY = .25, cpEndThreshY = .75

    distanceBetweenX = endX - startX
    cp1.x = startX + (distanceBetweenX * cpStartThreshX)
    cp2.x = startX + (distanceBetweenX * cpEndThreshX)
    if (startX > endX) {
      cp1.x += bendX
      cp2.x += bendX
    } else {
      cp1.x -= bendX
      cp2.x -= bendX
    }

    distanceBetweenY = endY - startY
    cp1.y = startY + (distanceBetweenY * cpStartThreshY) - bendY
    cp2.y = startY + (distanceBetweenY * cpEndThreshY) - bendY

    return {
      cp1, cp2
    }

  }

  const drawLinesFromCenter = (groupName, groupArray, loc, _i, i) => {
    let fifthRingPath = `
      M ${innerWidth/2}, ${innerWidth/2}
      m -${innerWidth * .375}, 0
      a ${innerWidth * .375},${innerWidth * .375} 0 1,0 ${innerWidth * .75},0
      a ${innerWidth * .375},${innerWidth * .375} 0 1,0 -${innerWidth * .75},0
    `;
    let fourthRingPath = `
      M ${innerWidth/2}, ${innerWidth/2}
      m -${innerWidth * .3}, 0
      a ${innerWidth * .3},${innerWidth * .3} 0 1,0 ${innerWidth * .6},0
      a ${innerWidth * .3},${innerWidth * .3} 0 1,0 -${innerWidth * .6},0
    `;
    let thirdRingPath = `
      M ${innerWidth/2}, ${innerWidth/2}
      m -${innerWidth * .225}, 0
      a ${innerWidth * .225},${innerWidth * .225} 0 1,0 ${innerWidth * .45},0
      a ${innerWidth * .225},${innerWidth * .225} 0 1,0 -${innerWidth * .45},0
    `;
    let secondRingPath = `
      M ${innerWidth/2}, ${innerWidth/2}
      m -${innerWidth * .15}, 0
      a ${innerWidth * .15},${innerWidth * .15} 0 1,0 ${innerWidth * .3},0
      a ${innerWidth * .15},${innerWidth * .15} 0 1,0 -${innerWidth * .3},0
    `;
    let firstRingPath = `
      M ${innerWidth/2}, ${innerWidth/2}
      m -${innerWidth * .075}, 0
      a ${innerWidth * .075},${innerWidth * .075} 0 1,0 ${innerWidth * .15},0
      a ${innerWidth * .075},${innerWidth * .075} 0 1,0 -${innerWidth * .15},0
    `;
    const getProperRing = gpName => {
      switch (gpName) {
        case 'one':
          return firstRingPath
          break;
        case 'two':
          return secondRingPath
          break;
        case 'three':
          return thirdRingPath
          break;
        case 'four':
          return fourthRingPath
          break;
        case 'five':
          return fifthRingPath
          break;
        default:
          return firstRingPath
      }
    }

    let path = `
      M ${innerWidth/2}, ${innerWidth/2}
      L ${ loc.longitude < selectedOriginSpidermap.longitude ? 0 : innerWidth },
        ${
          groupName != 'one' && groupName != 'two'
          ? (((innerWidth/selectedDestinationsSpidermap.length) * _i) * 2.75) - (((innerWidth/selectedDestinationsSpidermap.length) * _i) * .75)
          : (((innerWidth/selectedDestinationsSpidermap.length) * _i) * 10)
        }
    `;
    let point = intersect(getProperRing(groupName), path)[0]
    let { cp1, cp2 } = calcPath(point.x, point.y, groupName)
    
    return (
          <g key={`path-ring-${groupName}-${_i}`}>
            <path
              id={`${loc.city}-path`}
              ref={pathRefs[i]}
              fill={'none'}
              stroke={'#006CC4'}
              strokeWidth={2}
              d={`
                M ${innerWidth/2}, ${innerWidth/2}
                C ${cp1.x},${cp1.y}
                  ${cp2.x},${cp2.y}
                  ${point.x},${point.y}
              `}>
            </path>
            {
              /*
              <rect
                fill={'#fff'}
                width={50}
                height={10}
                x={
                  point.x < (innerWidth/2) ? point.x - 50 : point.x
                }
                y={point.y}>
              </rect>
              */
            }
            <circle
              id={`${loc.city}-dot`}
              ref={dotRefs[i]}
              r={5}
              cx={point.x}
              cy={point.y}
              fill={'#000'}>
            </circle>
            <text
              id={`${loc.city}-text`}
              ref={textRefs[i]}
              style={{
                textAlign: 'center',
                fontSize: '.3rem'
              }}
              x={
                point.x < (innerWidth/2)
                ?
                  point.x - (
                    selectedDestinationsSpidermap && textRefs[_i] && textRefs[_i].current
                    ? (textRefs[_i].getBBox().width + 10)
                    : 0
                  )
                :
                  (point.x + 10)
              }
              y={
                point.y < (innerWidth/2)
                ?
                  point.y - 1
                :
                  point.y + 5
              }>
              {loc.city}, {loc.code}
            </text>
          </g>
        )
  }

  useEffect(() => {
    if (selectedDestinationsSpidermap.length != 0) {
      // i = 0
      setSpidermapCodes(sortCodesForSpidermap(selectedDestinationsSpidermap))
      dispatch({ type: RERENDER_HACK, payload: true })
      setTimeout(() => dispatch({ type: RERENDER_HACK, payload: false }), 1)
    } else {
      props.history.push('/spidermap')
    }
  }, [])

  return (
    <>
      <div
        id='map-content'
        className='col-med pdf-content'
        style={{
          height:'100vh', backgroundColor: '#fff',
        }}>
        <svg
          ref={svgRef}
          style={{
            top: 0, bottom: 0,
            left: 0, right: 0,
            position: 'absolute',
            backgroundColor:'#fff',
          }}
          width={innerWidth}
          height={innerWidth}>
          <g>
            {
              spidermapCodes && (
                Object.keys(spidermapCodes).map(group => {
                  return spidermapCodes[group].map((loc, _i) => {
                    i++
                    return drawLinesFromCenter(group, spidermapCodes[group], loc, _i, i)
                  })
                })
              )
            }
            <circle
              r={10}
              fill={'#000'}
              stroke={'#000'}
              cx={innerWidth/2}
              cy={innerWidth/2}>
            </circle>
            <rect
              fill={'#fff'}
              x={ (originTextRef && originTextRef.current ? originTextRef.current.getBBox().x - 2 : 0) }
              y={ (originTextRef && originTextRef.current ? originTextRef.current.getBBox().y - 3 : 0) }
              width={ (originTextRef && originTextRef.current ? originTextRef.current.getBBox().width + 4 : 0) }
              height={ (originTextRef && originTextRef.current ? originTextRef.current.getBBox().height + 4 : 0) }>
            </rect>
            <text
              ref={originTextRef}
              style={{
                fontWeight: 'bolder'
              }}
              x={ (originTextRef && originTextRef.current ? innerWidth/2 - originTextRef.current.getBBox().width/2 : 0) }
              y={ (originTextRef && originTextRef.current ? innerWidth/2 - originTextRef.current.getBBox().height * 1.5 : 0) }>
              {selectedOriginSpidermap && selectedOriginSpidermap.city},&nbsp;
              {selectedOriginSpidermap && selectedOriginSpidermap.code}
            </text>
            {
              rerenderHack
              ? <div></div>
              : null
            }
          </g>
        </svg>
        {
          spidermapCodes && Object.keys(spidermapCodes).map(group => {
            return spidermapCodes[group].map((loc, _i) => {
              return (
                <div
                  style={{
                    position: 'absolute',
                    // transform: `translate(${}, ${})`
                  }}>
                  { loc.city }
                </div>
              )
            })
          })
        }
      </div>
    </>
  )

}

export default withRouter(GenerateSpidermapTest)
