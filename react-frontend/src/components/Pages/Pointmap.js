import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SelectionView from '../Views/SelectionView'
import Dropdown from '../Dropdowns/Dropdown'
import SelectBy_Origins from '../Views/SelectBy_Origins'
import SelectBy_Destinations from '../Views/SelectBy_Destinations'
import { checkAuth } from '../../sessionStore'
import {
  LAST_LOCATION,
  SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP,
  HIDE_SELECT_BY_CODE_ORIGINS,
  HIDE_SELECT_BY_CATEGORY_ORIGINS,
  HIDE_SELECT_BY_CODE_DESTINATIONS,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS,
  HIDE_DESTINATION_PANEL
} from '../../constants/constants'

const Pointmap = ({ ...props }) => {

  const dispatch = useDispatch()

  const currentlySelectedOriginPointmap = useSelector(state => state.currentlySelectedOriginPointmap)

  const destinationPanelVisibility = useSelector(state => state.destinationPanelVisibility)

  const selectBy_OriginsVisibility = useSelector(state => state.selectBy_OriginsVisibility)

  const selectBy_DestinationsVisibility = useSelector(state => state.selectBy_DestinationsVisibility)

  const selectByCodeOrigins = useSelector(state => state.selectByCodeOrigins)

  const selectByCategoryOrigins = useSelector(state => state.selectByCategoryOrigins)

  const selectByCodeDestinations = useSelector(state => state.selectByCodeDestinations)

  const selectByCategoryDestinations = useSelector(state => state.selectByCategoryDestinations)

  const lastLocation = useSelector(state => state.lastLocation)

  useEffect(() => {
    if (!checkAuth()) {
      setTimeout(() => props.history.push('/'))
    } else {
      console.log('user is logged in')
    }
  }, [])

  const resetPanels = () => {
    dispatch({ type: HIDE_SELECT_BY_CODE_ORIGINS })
    dispatch({ type: HIDE_SELECT_BY_CATEGORY_ORIGINS })
    dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS })
    dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS })
    dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS })
    dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS })
    dispatch({ type: HIDE_DESTINATION_PANEL })
  }

  const backButtonHandler = () => {
    props.history.push(`/${lastLocation}`)
    batch(() => {
      dispatch({ type: SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP, payload: null })
      dispatch({ type: LAST_LOCATION, payload: 'pointmap' })
      resetPanels()
    })
  }

  return (
    <>
      <button style={{margin:'2px'}}
              className='button-plain'
              onClick={backButtonHandler}>Back</button>
      <br/>
      <br/>
      <div>Create a Point-to-Point Map</div>
      <br/>
      <div className='row'>
        <div className='col-med' style={{height:'100vh'}}>
          <SelectionView type='pointmap-origins'/>
        </div>
        {
          destinationPanelVisibility
          ?
           (<div className='col-med' style={{height:'100vh'}}>
             <SelectionView type='pointmap-destinations'/>
           </div>)
          : null
        }
        {
          selectBy_OriginsVisibility ? <SelectBy_Origins/> : null
        }
        {
          selectByCodeOrigins == true
          ?
           (<>
             <div className='col-med' style={{height:'100vh',margin:'0 0 0 20px',backgroundColor:'orange'}}>
               <div>select Origins by airport code: &nbsp;</div>
               <Dropdown type='code' output='pointmap-origins'/>
             </div>
           </>) : null
        }
        {
          selectByCategoryOrigins == true
          ?
           (<>
             <div className='col-med' style={{height:'100vh',margin:'0 0 0 20px',backgroundColor:'orange'}}>
               <div>select Origins by airport code: &nbsp;</div>
               <Dropdown type='category' output='pointmap-origins'/>
             </div>
           </>) : null
        }
        {
          selectBy_DestinationsVisibility ? <SelectBy_Destinations/> : null
        }
        {
          selectByCodeDestinations == true
          ?
           (<>
             <div className='col-med' style={{height:'100vh',margin:'0 0 0 20px',backgroundColor:'orange'}}>
               <div>select Destinations by airport code: &nbsp;</div>
               <Dropdown type='code' output='pointmap-destinations'/>
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
               <Dropdown type='category' output='pointmap-destinations'/>
             </div>
            </>)
          : null
        }
      </div>
    </>
  )

}

export default withRouter(Pointmap)
