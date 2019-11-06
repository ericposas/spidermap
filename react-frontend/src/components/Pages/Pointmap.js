import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SelectionView from '../Views/SelectionView'
import Dropdown from '../Dropdowns/Dropdown'
import SelectBy_Origins from '../Views/SelectBy_Origins'
import SelectBy_Destinations_Pointmap from '../Views/SelectBy_Destinations_Pointmap'
import { checkAuth } from '../../sessionStore'
import { LAST_LOCATION } from '../../constants/constants'
import {
  SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP,
  HIDE_SELECT_BY_CODE_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_POINTMAP,
  HIDE_DESTINATION_PANEL_POINTMAP
} from '../../constants/pointmap'

const Pointmap = ({ ...props }) => {

  const dispatch = useDispatch()

  const currentlySelectedOriginPointmap = useSelector(state => state.currentlySelectedOriginPointmap)

  const pointmap_destinationPanelVisibility = useSelector(state => state.pointmap_destinationPanelVisibility)

  const pointmap_selectBy_OriginsVisibility = useSelector(state => state.pointmap_selectBy_OriginsVisibility)

  const pointmap_selectBy_DestinationsVisibility = useSelector(state => state.pointmap_selectBy_DestinationsVisibility)

  const pointmap_selectByCodeOrigins = useSelector(state => state.pointmap_selectByCodeOrigins)

  const pointmap_selectByCategoryOrigins = useSelector(state => state.pointmap_selectByCategoryOrigins)

  const pointmap_selectByCodeDestinations = useSelector(state => state.pointmap_selectByCodeDestinations)

  const pointmap_selectByCategoryDestinations = useSelector(state => state.pointmap_selectByCategoryDestinations)

  const selectedDestinationsPointmap = useSelector(state => state.selectedDestinationsPointmap)

  const lastLocation = useSelector(state => state.lastLocation)

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
      <div>Create a Point-to-Point Map</div>
      <br/>
      <div className='row'>
        <div className='col-med' style={{height:'100vh'}}>
          <SelectionView type='pointmap-origins'/>
        </div>
        {
          pointmap_destinationPanelVisibility
          ?
           (<div className='col-med' style={{height:'100vh'}}>
             <SelectionView type='pointmap-destinations'/>
           </div>)
          : null
        }
        {
          pointmap_selectBy_OriginsVisibility ? <SelectBy_Origins type='pointmap'/> : null
        }
        {
          pointmap_selectByCodeOrigins == true
          ?
           (<>
             <div className='col-med' style={{height:'100vh',margin:'0 0 0 20px',backgroundColor:'orange'}}>
               <div>select Origins by airport code: &nbsp;</div>
               <Dropdown type='code' output='pointmap-origins'/>
             </div>
           </>) : null
        }
        {
          pointmap_selectByCategoryOrigins == true
          ?
           (<>
             <div className='col-med' style={{height:'100vh',margin:'0 0 0 20px',backgroundColor:'orange'}}>
               <div>select Origins by airport code: &nbsp;</div>
               <Dropdown type='category' output='pointmap-origins'/>
             </div>
           </>) : null
        }
        {
          pointmap_selectBy_DestinationsVisibility ? <SelectBy_Destinations_Pointmap/> : null
        }
        {
          pointmap_selectByCodeDestinations == true
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
          pointmap_selectByCategoryDestinations == true
          ?
           (<>
             <div className='col-med' style={{height:'100vh',margin:'0 0 0 20px',backgroundColor:'orange'}}>
               <div>select Destinations by category: &nbsp;</div>
               <Dropdown type='category' output='pointmap-destinations'/>
             </div>
            </>)
          : null
        }
        {
            selectedDestinationsPointmap
            ?
              (<button onClick={() => { props.history.push('/generate-pointmap') }}>
                Generate Pointmap
              </button>)
            : null
        }
      </div>
    </>
  )

}

export default withRouter(Pointmap)
