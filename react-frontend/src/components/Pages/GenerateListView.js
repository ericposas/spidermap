import React, { useRef, useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import './generate-listview.scss'

const GenerateListView = ({ ...props }) => {

  const origin = useSelector(state => state.selectedOriginListView)

  const destinations = useSelector(state => state.selectedDestinationsListView)

  useEffect(() => {
    if (!origin) props.history.push('/listview')
  }, [])

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
          <div className='listview-destinations-list'>
            { destinations.map(d => <Fragment key={d.code}><div>{ d.code }</div></Fragment>) }
          </div>
        </div>
      </div>
    </>
  )

}

export default withRouter(GenerateListView)
