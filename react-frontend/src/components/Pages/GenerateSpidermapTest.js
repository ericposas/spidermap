import React, { useEffect, useState, useRef, createRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getUser } from '../../sessionStore'
import { SET_ALL_CODES } from '../../constants/constants'
import intersect from 'path-intersection'
import axios from 'axios'

const GenerateSpidermapTest = ({ ...props }) => {

  // let i = 0

  // const pathsRef = useRef(destinations.map(() => createRef()))

  const sortFunction = (a, b) => {
    if (a < b) return -1
    if (a > b) return 1
    return 0
  }

  const dispatch = useDispatch()

  // const allCodes = useSelector(state => state.allCodesData)

  const selectedOriginSpidermap = useSelector(state => state.selectedOriginSpidermap)

  const selectedDestinationsSpidermap = useSelector(state => state.selectedDestinationsSpidermap)

  const destinationTextRefs = useRef(selectedDestinationsSpidermap.sort(sortFunction).map(() => createRef()))

  const mapDotRefs = useRef(selectedDestinationsSpidermap.sort(sortFunction).map(() => createRef()))

  const [spidermapCodes, setSpidermapCodes] = useState(null)

  const originTextRef = useRef()

  const svgRef = useRef()

  const [rerenderHack, setRerenderHack] = useState(false)

  // const destinations = useSelector(state => state.selectedDestinationsSpidermap)

  const sortCodesForSpidermap = data => {

    let firstRing =[], secondRing = [], thirdRing = [], fourthRing = []

    data.forEach(dest => {
      if ((selectedOriginSpidermap.longitude - dest.longitude) < -20 && (selectedOriginSpidermap.longitude - dest.longitude) > -300) {
        fourthRing.push(dest)
      }
      if ((selectedOriginSpidermap.longitude - dest.longitude) < -15 && (selectedOriginSpidermap.longitude - dest.longitude) > -20) {
        thirdRing.push(dest)
      }
      if ((selectedOriginSpidermap.longitude - dest.longitude) < -10 && (selectedOriginSpidermap.longitude - dest.longitude) > -15) {
        secondRing.push(dest)
      }
      if ((selectedOriginSpidermap.longitude - dest.longitude) < 0 && (selectedOriginSpidermap.longitude - dest.longitude) > -10) {
        firstRing.push(dest)
      }
      if ((selectedOriginSpidermap.longitude - dest.longitude) > 0 && (selectedOriginSpidermap.longitude - dest.longitude) < 10) {
        firstRing.push(dest)
      }
      if ((selectedOriginSpidermap.longitude - dest.longitude) > 10 && (selectedOriginSpidermap.longitude - dest.longitude) < 15) {
        secondRing.push(dest)
      }
      if ((selectedOriginSpidermap.longitude - dest.longitude) > 15 && (selectedOriginSpidermap.longitude - dest.longitude) < 20) {
        thirdRing.push(dest)
      }
      if ((selectedOriginSpidermap.longitude - dest.longitude) > 20 && (selectedOriginSpidermap.longitude - dest.longitude) < 300) {
        fourthRing.push(dest)
      }

    })

    firstRing = firstRing.sort(sortFunction)
    secondRing = secondRing.sort(sortFunction)
    thirdRing = thirdRing.sort(sortFunction)
    fourthRing = fourthRing.sort(sortFunction)
    
    return {
      'one': firstRing,
      'two': secondRing,
      'three': thirdRing,
      'four': fourthRing,
    }

  }

  const calcPath = (endX, endY, groupName) => {

    let cp1 = {}, cp2 = {}
    let startX = innerWidth/2, startY = innerWidth/2
    let distanceBetweenX, distanceBetweenY
    let bendX = (
      groupName == 'four'
      ? 50
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
      groupName == 'four'
      ? innerWidth * .05
      :
        groupName == 'three'
        ? innerWidth * .025
        :
          groupName == 'two'
          ? innerWidth * .015
          :
            groupName == 'one'
            ? innerWidth * .01
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

  const calcYRadial = (groupArray, _i) => ((((innerWidth * 2)/(groupArray.length * 2)) * _i) - (innerWidth/4))

  const calcYRadialExtra = (groupArray, _i) => ((((innerWidth * 4)/(groupArray.length * 2)) * _i) - (innerWidth * .65))

  const drawLinesFromCenter = (groupName, groupArray, loc, _i) => {
    let fourthRingPath = `
      M ${innerWidth/2}, ${innerWidth/2}
      m -${innerWidth * .35}, 0
      a ${innerWidth * .35},${innerWidth * .35} 0 1,0 ${innerWidth * .7},0
      a ${innerWidth * .35},${innerWidth * .35} 0 1,0 -${innerWidth * .7},0
    `;
    let thirdRingPath = `
      M ${innerWidth/2}, ${innerWidth/2}
      m -${innerWidth * .25}, 0
      a ${innerWidth * .25},${innerWidth * .25} 0 1,0 ${innerWidth * .5},0
      a ${innerWidth * .25},${innerWidth * .25} 0 1,0 -${innerWidth * .5},0
    `;
    let secondRingPath = `
      M ${innerWidth/2}, ${innerWidth/2}
      m -${innerWidth * .175}, 0
      a ${innerWidth * .175},${innerWidth * .175} 0 1,0 ${innerWidth * .35},0
      a ${innerWidth * .175},${innerWidth * .175} 0 1,0 -${innerWidth * .35},0
    `;
    let firstRingPath = `
      M ${innerWidth/2}, ${innerWidth/2}
      m -${innerWidth * .1}, 0
      a ${innerWidth * .1},${innerWidth * .1} 0 1,0 ${innerWidth * .2},0
      a ${innerWidth * .1},${innerWidth * .1} 0 1,0 -${innerWidth * .2},0
    `;
    switch (groupName) {
      case 'four': {
        let path = `
          M ${innerWidth/2}, ${innerWidth/2}
          L ${ loc.longitude < selectedOriginSpidermap.longitude ? 0 : innerWidth }, ${calcYRadialExtra(groupArray, _i)}
        `;
        let point = intersect(fourthRingPath, path)[0]
        let { cp1, cp2 } = calcPath(point.x, point.y, groupName)
        return (
          <g key={'path-ring-four-'+_i}>
            <path
              fill={'none'}
              stroke={'#006CC4'}
              strokeWidth={2}
              d={`
                M ${innerWidth/2}, ${innerWidth/2}
                C ${cp1.x},${cp1.y}
                  ${cp2.x},${cp2.y}
                  ${point.x},${point.y}`
                }>
            </path>
            <circle
              ref={mapDotRefs.current[_i]}
              r={5}
              cx={point.x}
              cy={point.y}
              fill={'#000'}>
            </circle>
            <text
              ref={destinationTextRefs.current[_i]}
              style={{
                fontSize: '.65rem'
              }}
              x={
                loc.longitude < selectedOriginSpidermap.longitude
                ?
                  point.x - (
                    selectedDestinationsSpidermap && destinationTextRefs.current && destinationTextRefs.current[_i] && destinationTextRefs.current[_i].current
                    ? destinationTextRefs.current[_i].current.getBBox().width + 10
                    : 0
                  )
                :
                  (point.x + 10)
              }
              y={
                point.y > innerHeight/2
                ?
                  point.y + (
                    selectedDestinationsSpidermap && destinationTextRefs.current && destinationTextRefs.current[_i] && destinationTextRefs.current[_i].current
                    ? destinationTextRefs.current[_i].current.getBBox().height
                    : 0
                  )
                :
                  point.y - (
                    selectedDestinationsSpidermap && destinationTextRefs.current && destinationTextRefs.current[_i] && destinationTextRefs.current[_i].current
                    ? destinationTextRefs.current[_i].current.getBBox().height * .5
                    : 0
                  )
              }>
              {loc.city}, {loc.code}
            </text>
          </g>
        )
      }
        break;
      case 'three': {
        let path = `
          M ${innerWidth/2}, ${innerWidth/2}
          L ${ loc.longitude < selectedOriginSpidermap.longitude ? 0 : innerWidth }, ${calcYRadial(groupArray, _i)}
        `;
        let point = intersect(thirdRingPath, path)[0]
        let { cp1, cp2 } = calcPath(point.x, point.y, groupName)
        return (
          <g key={'path-ring-three-'+_i}>
            {/*<path
              stroke={'#000'}
              strokeWidth={'1'}
              d={path}>
              </path>*/}
            {/*<path
              stroke={'#000'}
              strokeWidth={'1'}
              d={`
                M ${innerWidth/2}, ${innerWidth/2}
                L ${point.x}, ${point.y}
                `}>
              </path>*/}
            <path
              fill={'none'}
              stroke={'#006CC4'}
              strokeWidth={2}
              d={`
                M ${innerWidth/2}, ${innerWidth/2}
                C ${cp1.x},${cp1.y}
                  ${cp2.x},${cp2.y}
                  ${point.x},${point.y}`
                }>
            </path>
            <circle
              ref={mapDotRefs.current[_i]}
              r={5}
              cx={point.x}
              cy={point.y}
              fill={'#000'}>
            </circle>
            <text
              ref={destinationTextRefs.current[_i]}
              style={{
                fontSize: '.65rem'
              }}
              x={
                loc.longitude < selectedOriginSpidermap.longitude
                ?
                  point.x - (
                    selectedDestinationsSpidermap && destinationTextRefs.current && destinationTextRefs.current[_i] && destinationTextRefs.current[_i].current
                    ? destinationTextRefs.current[_i].current.getBBox().width + 10
                    : 0
                  )
                :
                  (point.x + 10)
              }
              y={
                point.y > innerHeight/2
                ?
                  point.y + (
                    selectedDestinationsSpidermap && destinationTextRefs.current && destinationTextRefs.current[_i] && destinationTextRefs.current[_i].current
                    ? destinationTextRefs.current[_i].current.getBBox().height
                    : 0
                  )
                :
                  point.y - (
                    selectedDestinationsSpidermap && destinationTextRefs.current && destinationTextRefs.current[_i] && destinationTextRefs.current[_i].current
                    ? destinationTextRefs.current[_i].current.getBBox().height * .5
                    : 0
                  )
              }>
              {loc.city}, {loc.code}
            </text>
          </g>
        )
      }
        break;
      case 'two': {
        let path = `
          M ${innerWidth/2}, ${innerWidth/2}
          L ${ loc.longitude < selectedOriginSpidermap.longitude ? 0 : innerWidth }, ${calcYRadial(groupArray, _i)}
        `;
        let point = intersect(secondRingPath, path)[0]
        let { cp1, cp2 } = calcPath(point.x, point.y, groupName)
        return (
          <g key={'path-ring-two-'+_i}>
            <path
              fill={'none'}
              stroke={'#006CC4'}
              strokeWidth={2}
              d={`
                M ${innerWidth/2}, ${innerWidth/2}
                C ${cp1.x},${cp1.y}
                  ${cp2.x},${cp2.y}
                  ${point.x},${point.y}`
                }>
            </path>
            <circle
              ref={mapDotRefs.current[_i]}
              r={5}
              cx={point.x}
              cy={point.y}
              fill={'#000'}>
            </circle>
            <text
              ref={destinationTextRefs.current[_i]}
              style={{
                fontSize: '.65rem'
              }}
              x={
                loc.longitude < selectedOriginSpidermap.longitude
                ?
                  point.x - (
                    selectedDestinationsSpidermap && destinationTextRefs.current && destinationTextRefs.current[_i] && destinationTextRefs.current[_i].current
                    ? destinationTextRefs.current[_i].current.getBBox().width + 10
                    : 0
                  )
                :
                  (point.x + 10)
              }
              y={
                point.y > innerHeight/2
                ?
                  point.y + (
                    selectedDestinationsSpidermap && destinationTextRefs.current && destinationTextRefs.current[_i] && destinationTextRefs.current[_i].current
                    ? destinationTextRefs.current[_i].current.getBBox().height
                    : 0
                  )
                :
                  point.y - (
                    selectedDestinationsSpidermap && destinationTextRefs.current && destinationTextRefs.current[_i] && destinationTextRefs.current[_i].current
                    ? destinationTextRefs.current[_i].current.getBBox().height * .5
                    : 0
                  )
              }>
              {loc.city}, {loc.code}
            </text>
          </g>
        )
      }
        break;
      case 'one': {
        let path = `
          M ${innerWidth/2}, ${innerWidth/2}
          L ${ loc.longitude < selectedOriginSpidermap.longitude ? 0 : innerWidth }, ${calcYRadial(groupArray, _i)}
        `;
        let point = intersect(firstRingPath, path)[0]
        let { cp1, cp2 } = calcPath(point.x, point.y, groupName)
        return (
          <g key={`path-ring-one-${_i}`}>
            <path
              fill={'none'}
              stroke={'#006CC4'}
              strokeWidth={2}
              d={`
                M ${innerWidth/2}, ${innerWidth/2}
                C ${cp1.x},${cp1.y}
                  ${cp2.x},${cp2.y}
                  ${point.x},${point.y}`
              }>
            </path>
            <circle
              ref={mapDotRefs.current[_i]}
              r={5}
              cx={point.x}
              cy={point.y}
              fill={'#000'}>
            </circle>
            <text
              ref={destinationTextRefs.current[_i]}
              style={{
                fontSize: '.65rem'
              }}
              x={
                loc.longitude < selectedOriginSpidermap.longitude
                ?
                  point.x - (
                    selectedDestinationsSpidermap && destinationTextRefs.current && destinationTextRefs.current[_i] && destinationTextRefs.current[_i].current
                    ? destinationTextRefs.current[_i].current.getBBox().width + 10
                    : 0
                  )
                :
                  (point.x + 10)
              }
              y={
                point.y > innerHeight/2
                ?
                  point.y + (
                    selectedDestinationsSpidermap && destinationTextRefs.current && destinationTextRefs.current[_i] && destinationTextRefs.current[_i].current
                    ? destinationTextRefs.current[_i].current.getBBox().height
                    : 0
                  )
                :
                  point.y - (
                    selectedDestinationsSpidermap && destinationTextRefs.current && destinationTextRefs.current[_i] && destinationTextRefs.current[_i].current
                    ? destinationTextRefs.current[_i].current.getBBox().height * .5
                    : 0
                  )
              }>
              {loc.city}, {loc.code}
            </text>
          </g>
        )
      }
        break;
      default:

    }

  }

  // <rect
  //   fill={'red'}
  //   x={(
  //     selectedDestinationsSpidermap && destinationTextRefs.current && destinationTextRefs.current[_i] && destinationTextRefs.current[_i].current
  //     ? destinationTextRefs.current[_i].current.getBBox().x
  //     : 0
  //   )}
  //   y={(
  //     selectedDestinationsSpidermap && destinationTextRefs.current && destinationTextRefs.current[_i] && destinationTextRefs.current[_i].current
  //     ? destinationTextRefs.current[_i].current.getBBox().y
  //     : 0
  //   )}
  //   width={(
  //     selectedDestinationsSpidermap && destinationTextRefs.current && destinationTextRefs.current[_i] && destinationTextRefs.current[_i].current
  //     ? destinationTextRefs.current[_i].current.getBBox().width
  //     : 0
  //   )}
  //   height={(
  //     selectedDestinationsSpidermap && destinationTextRefs.current && destinationTextRefs.current[_i] && destinationTextRefs.current[_i].current
  //     ? destinationTextRefs.current[_i].current.getBBox().height
  //     : 0
  //   )}>
  // </rect>

  // const mapByLongitudeGrouping = (groupName, groupArray, _i) => {
  //   switch (groupName) {
  //     case 'left3':
  //       return (
  //         <g>
  //           <circle
  //             key={'left3-grouping-'+_i}
  //             r={2}
  //             cx={10}
  //             cy={(innerWidth * .005) * _i}
  //             fill={'red'}>
  //           </circle>
  //         </g>
  //       )
  //       break;
  //     case 'left2':
  //       return (
  //         <g>
  //           <circle
  //             key={'left2-grouping'+_i}
  //             r={2}
  //             cx={100}
  //             cy={(innerWidth * .005) * _i}
  //             fill={'red'}>
  //           </circle>
  //         </g>
  //       )
  //       break;
  //     case 'left1':
  //       return (
  //         <g>
  //           <circle
  //             key={'left1-grouping'+_i}
  //             r={2}
  //             cx={200}
  //             cy={(innerWidth * .005) * _i}
  //             fill={'red'}>
  //           </circle>
  //         </g>
  //       )
  //       break;
  //     default:
  //       return (
  //         <g>
  //           <circle
  //             key={'default-grouping'+_i}
  //             r={2}
  //             cx={10}
  //             cy={20}
  //             fill={'red'}>
  //           </circle>
  //         </g>
  //       )
  //   }
  // }

  // const getRef = _i => {
  //   if (selectedDestinationsSpidermap && destinationTextRefs.current && destinationTextRefs.current[_i] && destinationTextRefs.current[_i].current) {
  //     return destinationTextRefs.current[_i].current
  //   } else {
  //     console.log('cannot find ref')
  //   }
  // }

  useEffect(() => {
    if (selectedDestinationsSpidermap.length != 0) {
      setSpidermapCodes(sortCodesForSpidermap(selectedDestinationsSpidermap))
      setTimeout(() => setRerenderHack(true), 1)
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
            {/*<path
              fill={'none'}
              stroke={'#000'}
              strokeWidth={'1'}
              d={`
                M ${innerWidth/2}, ${innerWidth/2}
                m -${innerWidth * .3}, 0
                a ${innerWidth * .3},${innerWidth * .3} 0 1,0 ${innerWidth * .6},0
                a ${innerWidth * .3},${innerWidth * .3} 0 1,0 -${innerWidth * .6},0
              `}>
            </path>
            <path
              fill={'none'}
              stroke={'#000'}
              strokeWidth={'1'}
              d={`
                M ${innerWidth/2}, ${innerWidth/2}
                m -${innerWidth * .2}, 0
                a ${innerWidth * .2},${innerWidth * .2} 0 1,0 ${innerWidth * .4},0
                a ${innerWidth * .2},${innerWidth * .2} 0 1,0 -${innerWidth * .4},0
              `}>
            </path>
            <path
              fill={'none'}
              stroke={'#000'}
              strokeWidth={'1'}
              d={`
                M ${innerWidth/2}, ${innerWidth/2}
                m -${innerWidth * .15}, 0
                a ${innerWidth * .15},${innerWidth * .15} 0 1,0 ${innerWidth * .3},0
                a ${innerWidth * .15},${innerWidth * .15} 0 1,0 -${innerWidth * .3},0
              `}>
            </path>
            <path
              fill={'none'}
              stroke={'#000'}
              strokeWidth={'1'}
              d={`
                M ${innerWidth/2}, ${innerWidth/2}
                m -${innerWidth * .1}, 0
                a ${innerWidth * .1},${innerWidth * .1} 0 1,0 ${innerWidth * .2},0
                a ${innerWidth * .1},${innerWidth * .1} 0 1,0 -${innerWidth * .2},0
              `}>
            </path>*/}
            {/*}<circle
              r={innerWidth * .35}
              stroke={'#000'}
              fill={'none'}
              cx={innerWidth/2}
              cy={innerWidth/2}>
              </circle>*/}
            {
              spidermapCodes && (
                Object.keys(spidermapCodes).map(group => {
                  // i++
                  // return spidermapCodes[group].map((loc, i) => mapByLongitudeGrouping(group, spidermapCodes[group], i))
                  return spidermapCodes[group].map((loc, _i) => drawLinesFromCenter(group, spidermapCodes[group], loc, _i))
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
            <text
              ref={originTextRef}
              x={ (originTextRef && originTextRef.current ? innerWidth/2 - originTextRef.current.getBBox().width/2 : 0) }
              y={ (originTextRef && originTextRef.current ? innerWidth/2 + originTextRef.current.getBBox().height * 1.5 : 0) }>
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
      </div>
    </>
  )

}

export default withRouter(GenerateSpidermapTest)
