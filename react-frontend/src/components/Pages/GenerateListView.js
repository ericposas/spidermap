import React, { useRef, useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import './generate-listview.scss'

const GenerateListView = ({ ...props }) => {

  const origin = useSelector(state => state.selectedOriginListView)

  const destinations = useSelector(state => state.selectedDestinationsListView)

  const [organizeByCategory, setOrganizeByCategory] = useState({})

  const regionsDict = []

  const regionRef = useRef()

  useEffect(() => {
    if (!origin) props.history.push('/listview')
    let destinationsObject = {}
    destinations.forEach(d => {
      if (!destinationsObject[d.region]) destinationsObject[d.region] = []
      destinationsObject[d.region].push(d)
    })
    setOrganizeByCategory(destinationsObject)
    console.log(destinationsObject)
  }, [])

  const processByRegion = region => {
    let count = 0
    let arr = organizeByCategory[region].map((item,i) => {
      count++
      return (<Fragment key={item.code}>
                <div className='listview-city'>
                  {item.city}
                </div>
              </Fragment>)
    })

    let arrays = []

    for (let i = 0, incr = 20; i < arr.length; i+=incr) {
      let _arr = arr.slice(i, i + incr)
      console.log(_arr.length)
      let _arrLen = _arr.length

      if (i == 0) {
        _arr.unshift((
          <Fragment key={region + count + i}>
            <div>
              {region}
            </div>
          </Fragment>
        ))
        _arr.push((
          <Fragment key={'br' + count + i}>
            <br/>
            <br/>
          </Fragment>
        ))
      } else {
        _arr.unshift((
          <Fragment key={'spacer' + count + i}>
            <div><br/></div>
          </Fragment>
        ))
      }

      arrays.push((
        <Fragment key={'col' + count + i}>
          <div className='col-med listview-column'>
            <div
              style={{
                position: 'relative'
              }}>
              <div
                style={{
                  position: 'absolute',
                  transform: `scaleY(${_arrLen}) translateY(${_arrLen}px)`,
                  top: _arrLen == 1 ? '21px' : `calc(22px + ${(_arrLen-1) - ((_arrLen-1)/2)}px)`,
                }}
                className='listview-divider'>
                |
              </div>
            </div>
          {_arr}
          </div>
        </Fragment>
      ))

    }

    return arrays

  }

  return (
    <>
      <div className='white-backing'></div>
      <div className='listview-content'>
        <div className='listview-title-content'>
          <div className='listview-origin-title'>{ origin ? origin.code : '' }</div>
          <div className='listview-origin-title-divider'>|</div>
          <div className='listview-origin-subtitle'>
              &nbsp;&nbsp;Direct flights to and from<br/>
              &nbsp;&nbsp;{ origin ? origin.city : '' }, { origin ? origin.region : '' }
          </div>
          <br/>
          <br/>
          <div className='row'>
            {
              organizeByCategory
              ?
                Object.keys(organizeByCategory).map(region => {
                  return processByRegion(region)
                })
              : null
            }
          </div>
        </div>
      </div>
    </>
  )

}

export default withRouter(GenerateListView)
