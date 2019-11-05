import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SelectionView from '../Views/SelectionView'
import Dropdown from '../Dropdowns/Dropdown'
import SelectBy_Destinations from '../Views/SelectBy_Destinations'
import { checkAuth } from '../../sessionStore'
import { LAST_LOCATION } from '../../constants/constants'

const Spidermap = ({ ...props }) => {

  const dispatch = useDispatch()

  const lastLocation = useSelector(state => state.lastLocation)

  const selectedOriginSpidermap = useSelector(state => state.selectedOriginSpidermap)

  const selectByCodeDestinations = useSelector(state => state.selectByCodeDestinations)

  const selectByCategoryDestinations = useSelector(state => state.selectByCategoryDestinations)

  const selectBy_DestinationsVisibility = useSelector(state => state.selectBy_DestinationsVisibility)

  useEffect(() => {
    if (!checkAuth()) {
      setTimeout(() => props.history.push('/'))
    } else {
      console.log('user is logged in')
    }
  }, [])

  const backButtonHandler = () => {
    props.history.push(`/${lastLocation}`)
    dispatch({ type: LAST_LOCATION, payload: 'pointmap' })
  }

  return (
    <>
      <button style={{margin:'2px'}}
              className='button-plain'
              onClick={backButtonHandler}>Back</button>
      <br/>
      <br/>
      <div>Create a Spidermap</div>
      <br/>
      <div className='row'>
        <div className='col-med'>
          <div style={{margin:'0 0 0 20px'}}>select Origin by airport code: &nbsp;</div>
          <Dropdown type='code' output='spidermap-origin'/>
        </div>
        <div>
          <SelectionView type='spidermap-origin'/>
        </div>
        {
          selectedOriginSpidermap
          ?
            (<div>
              <SelectionView type='spidermap-destinations'/>
             </div>) : null
        }
        {
          selectBy_DestinationsVisibility
          ? <SelectBy_Destinations/>
          : null
        }
        {
          selectByCodeDestinations == true
          ?
           (<>
             <div className='col-med' style={{height:'100vh',margin:'0 0 0 20px',backgroundColor:'orange'}}>
               <div>select Destinations by airport code: &nbsp;</div>
               <Dropdown type='code' output='spidermap-destinations'/>
             </div>
            </>)
          : null
        }
        {
          selectByCategoryDestinations == true
          ?
           (<>
             <div className='col-med' style={{height:'100vh',margin:'0 0 0 20px',backgroundColor:'orange'}}>
               <div>select Destinations by category: &nbsp;</div>
               <Dropdown type='category' output='spidermap-destinations'/>
             </div>
            </>)
          : null
        }
      </div>
    </>
  )

}

export default withRouter(Spidermap)
