import React, { useRef, useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import '../../images/american-airlines-new-logo.svg'
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
            <div className='listview-region'>
              {
                region.trim() == 'United States'
                ? 'USA'
                : region
              }
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
            <div style={{ padding: '2.25rem 0 0 0' }}></div>
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
              {
                i == 0
                ?
                  (<div
                    style={{
                      position: 'absolute',
                      transform: _arrLen > 15 ? `scaleY(${_arrLen + 3})` : `scaleY(${_arrLen + 1})`,
                      top: _arrLen > 15 ? `calc(2rem + ${(_arrLen + 3) * .35}rem)` : `calc(2rem + ${_arrLen * .35}rem)`,
                    }}
                    className='listview-divider'>
                    |
                  </div>)
                : null
              }
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
        <div className='listview-logo-container'>
          <img
            className='listview-logo'
            src='./img/american-airlines-new-logo.svg'/>
        </div>
        <div className='listview-title-content'>
          <div className='listview-origin-title'>{ origin ? origin.code : '' }</div>
          <div className='listview-origin-title-divider'>
            <div className='listview-origin-title-divider-inner'>
              |
            </div>
          </div>
          <div className='listview-origin-subtitle'>
            <div className='listview-origin-subtitle-inner'>
              &nbsp;&nbsp;Direct flights to and from<br/>
              &nbsp;&nbsp;{ origin ? origin.city : '' }, { origin ? origin.region : '' }
            </div>
          </div>
          <br/>
          <br/>
        </div>
        <div className='listview-main-content'>
          <div className='row'>
          {
            organizeByCategory
            ?
            Object.keys(organizeByCategory).map(region => {
              return (<Fragment key={region}>
                {
                  region.trim() == 'United States' || organizeByCategory[region].length > 20
                  ? <div
                      className='row'
                      style={{
                        margin: '0 0 0 2px'
                      }}>{
                        processByRegion(region)
                      }
                    </div>
                  : processByRegion(region)
                }
                </Fragment>)
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
