import React, { useRef, useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import './generate-listview.scss'

const GenerateListView = ({ ...props }) => {

  const origin = useSelector(state => state.selectedOriginListView)

  const destinations = useSelector(state => state.selectedDestinationsListView)

  const [organizeByCategory, setOrganizeByCategory] = useState({})

  // const [regionsDict, setRegionsDict] = useState([])
  const regionsDict = []

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
                <div>
                  {item.city}
                </div>
              </Fragment>)
    })
    arr.unshift((
      <Fragment key={region + count}>
        <div>
          {region}
        </div>
      </Fragment>
    ))
    arr.push((
      <Fragment key={'br' + count}>
        <br/>
        <br/>
      </Fragment>
    ))
    return arr
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
          {/*<div className='listview-destinations-list'>
            { destinations.map(d => <Fragment key={d.code}><div>{ d.code }</div></Fragment>) }
          </div>*/}
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
    </>
  )

}

export default withRouter(GenerateListView)
