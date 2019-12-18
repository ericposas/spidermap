import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUser } from '../../sessionStore'
import { SET_ALL_CODES } from '../../constants/constants'
import intersect from 'path-intersection'
import axios from 'axios'

const GenerateSpidermapTest = ({ ...props }) => {

  let firstRing =[], secondRing = [], thirdRing = [], fourthRing = [], fifthRing = [], sixthRing = []

  const dispatch = useDispatch()

  const allCodes = useSelector(state => state.allCodesData)

  const [spidermapCodes, setSpidermapCodes] = useState(null)

  // const destinations = useSelector(state => state.selectedDestinationsSpidermap)

  const sortCodesForSpidermap = data => {

    data.forEach(dest => {
      if (dest.longitude < -120 && dest.longitude > -180) {
        thirdRing.push(dest)
      }
      if (dest.longitude < -60 && dest.longitude > -120) {
        secondRing.push(dest)
      }
      if (dest.longitude < 0 && dest.longitude > -60) {
        firstRing.push(dest)
      }
      if (dest.longitude > 0 && dest.longitude < 60) {
        fourthRing.push(dest)
      }
      if (dest.longitude > 60 && dest.longitude < 120) {
        fifthRing.push(dest)
      }
      if (dest.longitude > 120 && dest.longitude < 180) {
        sixthRing.push(dest)
      }

    })

    return {
      'left3': thirdRing,
      'left2': secondRing,
      'left1': firstRing,
      'right1': fourthRing,
      'right2': fifthRing,
      'right3': sixthRing
    }

  }

  const drawLinesFromCenter = (groupName, groupArray, _i) => {
    let largeCirclePath = `
      M ${innerWidth/2}, ${innerHeight/2}
      m -${innerWidth * .3}, 0
      a ${innerWidth * .3},${innerWidth * .3} 0 1,0 ${innerWidth * .6},0
      a ${innerWidth * .3},${innerWidth * .3} 0 1,0 -${innerWidth * .6},0
    `;
    switch (groupName) {
      case 'left3':
        let path = `
          M ${innerWidth/2}, ${innerHeight/2}
          L 20, ${40 * _i}
        `;
        let point = intersect(largeCirclePath, path)[0]
        return (
          <g key={'path-left2-'+_i}>
            <path
              stroke={'#000'}
              strokeWidth={'1'}
              d={path}>
            </path>
            <circle
              r={5}
              cx={point.x}
              cy={point.y}
              fill={'#000'}>
            </circle>
          </g>
        )
        break;
      default:

    }

  }

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

  useEffect(() => {
    axios.get(`/airports/byCode`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
         .then(data => {
           // dispatch({ type: SET_ALL_CODES, payload: data.data })
           setSpidermapCodes(sortCodesForSpidermap(data.data))
           console.log(
             firstRing,
             secondRing,
             thirdRing,
             fourthRing,
             fifthRing,
             sixthRing
           )
         })
         .catch(err => console.log(err))
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
          style={{
            position: 'absolute',
            backgroundColor:'#ccc',
            top: 0
          }}
          width={innerWidth}
          height={innerHeight}>
          <g>
            <path
              fill={'none'}
              stroke={'#000'}
              strokeWidth={'1'}
              d={`
                M ${innerWidth/2}, ${innerHeight/2}
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
                M ${innerWidth/2}, ${innerHeight/2}
                m -${innerWidth * .1}, 0
                a ${innerWidth * .1},${innerWidth * .1} 0 1,0 ${innerWidth * .2},0
                a ${innerWidth * .1},${innerWidth * .1} 0 1,0 -${innerWidth * .2},0
              `}>
            </path>

          </g>
          {/*}<circle
            r={innerWidth * .35}
            stroke={'#000'}
            fill={'none'}
            cx={innerWidth/2}
            cy={innerHeight/2}>
          </circle>*/}
          {
            spidermapCodes && (
              Object.keys(spidermapCodes).map(group => {
                // return spidermapCodes[group].map((loc, i) => mapByLongitudeGrouping(group, spidermapCodes[group], i))
                return spidermapCodes[group].map((loc, i) => drawLinesFromCenter(group, spidermapCodes[group], i))
              })
            )
          }
        </svg>
      </div>
    </>
  )

}

export default GenerateSpidermapTest
