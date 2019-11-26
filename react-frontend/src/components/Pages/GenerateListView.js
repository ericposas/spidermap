import React, { useRef, useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import UserLeftSidePanel from '../Views/UserLeftSidePanel'
import DownloadImagePanel from '../Views/DownloadImagePanel'
// import '../../images/american-airlines-new-logo.svg'
import '../../images/aa-logo.png'
import './generate-listview.scss'

const GenerateListView = ({ ...props }) => {

  const origin = useSelector(state => state.selectedOriginListView)

  const destinations = useSelector(state => state.selectedDestinationsListView)

  const [organizeByCategory, setOrganizeByCategory] = useState({})

  const listviewRendering = useSelector(state => state.listviewRendering)

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
                  {
                    item.city.split(/(?=[A-Z])/).map((_item,i) => (<Fragment key={_item+'-city-span'}><span>{_item}</span>{ i < (item.city.split(/(?=[A-Z])/).length-1) ? <span>&nbsp;</span> : '' }</Fragment>))
                  }
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
                : region.split(/(?=[A-Z])/).map((item,i) => (<Fragment key={item+'-region-span'}><span>{item}</span>{ i < (region.split(/(?=[A-Z])/).length-1) ? <span>&nbsp;</span> : '' }</Fragment>))
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
    <div className='row'>
      <UserLeftSidePanel/>
      <DownloadImagePanel type='listview' label='List View'/>
      <div
        className='col-med'
        style={{
          height:'100vh',
          backgroundColor: '#fff',
          boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
        }}>
        <div id='listview-content' className={listviewRendering ? 'listview-content listview-content-rendering' : 'listview-content'}>
          <div className='listview-logo-container'>
            <img
              className='listview-logo'
              src='./img/aa-logo.png'/>
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
                &nbsp;&nbsp;Direct&nbsp;flights&nbsp;to&nbsp;and&nbsp;from<br/>
                &nbsp;&nbsp;{
                  origin
                  ? origin.city.split(/(?=[A-Z])/).map((item,i) => (<Fragment key={item+'-span'}><span>{item}</span>{ i < (origin.city.split(/(?=[A-Z])/).length-1) ? <span>&nbsp;</span> : '' }</Fragment>))
                  : ''
                },&nbsp;
                {
                  origin
                  ? origin.region.split(/(?=[A-Z])/).map((item,i) => (<Fragment key={item+'-span'}><span>{item}</span>{ i < (origin.region.split(/(?=[A-Z])/).length-1) ? <span>&nbsp;</span> : '' }</Fragment>))
                  : ''
                }
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
      </div>
      </div>
    </>
  )

}

export default withRouter(GenerateListView)
