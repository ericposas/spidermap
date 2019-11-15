import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SelectionView from '../Views/SelectionView'
import Dropdown from '../Dropdowns/Dropdown'
import BackButton from '../Buttons/BackButton'
import SelectBy_Destinations_ListView from '../Views/SelectBy_Destinations_ListView'
import { checkAuth } from '../../sessionStore'
import { LAST_LOCATION } from '../../constants/constants'

const Spidermap = ({ ...props }) => {

  const dispatch = useDispatch()

  const lastLocation = useSelector(state => state.lastLocation)

  const selectedOriginListView = useSelector(state => state.selectedOriginListView)

  const listview_selectBy_DestinationsVisibility = useSelector(state => state.listview_selectBy_DestinationsVisibility)

  const listview_selectByCodeDestinations = useSelector(state => state.listview_selectByCodeDestinations)

  const listview_selectByCategoryDestinations = useSelector(state => state.listview_selectByCategoryDestinations)

  useEffect(() => {
    if (!checkAuth()) {
      setTimeout(() => props.history.push('/'))
    } else {
      console.log('user is logged in')
    }
  }, [])

  return (
    <>
      <BackButton/>
      <br/>
      <br/>
      <br/>
      <div>Create a List View</div>
      <br/>
      <div className='row'>
        <div className='col-med'>
          <div style={{margin:'0 0 0 20px'}}>select Origin by airport code: &nbsp;</div>
          <Dropdown type='code' output='listview-origin'/>
        </div>
        <div>
          <SelectionView type='listview-origin'/>
        </div>
        {
          selectedOriginListView
          ?
            (<div>
              <SelectionView type='listview-destinations'/>
             </div>) : null
        }
        {
          listview_selectBy_DestinationsVisibility && selectedOriginListView
          ? <SelectBy_Destinations_ListView/>
          : null
        }
        {
          listview_selectByCodeDestinations && selectedOriginListView
          ?
           (<>
             <div className='col-med' style={{height:'100vh',margin:'0 0 0 20px',backgroundColor:'orange'}}>
               <div>select Destinations by airport code: &nbsp;</div>
               <Dropdown type='code' output='listview-destinations'/>
             </div>
            </>)
          : null
        }
        {
          listview_selectByCategoryDestinations && selectedOriginListView
          ?
           (<>
             <div className='col-med' style={{height:'100vh',margin:'0 0 0 20px',backgroundColor:'orange'}}>
               <div>select Destinations by category: &nbsp;</div>
               <Dropdown type='category' output='listview-destinations'/>
             </div>
            </>)
          : null
        }
      </div>
    </>
  )

}

export default withRouter(Spidermap)
