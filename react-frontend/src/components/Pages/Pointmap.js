import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SelectionView from '../Views/SelectionView'
import Dropdown from '../Dropdowns/Dropdown'
import { checkAuth } from '../../sessionStore'
import {
  LAST_LOCATION,
  SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP,
  SHOW_SELECT_BY_CODE,
  HIDE_SELECT_BY_CODE,
  SHOW_SELECT_BY_CATEGORY,
  HIDE_SELECT_BY_CATEGORY,
} from '../../constants/constants'

const Pointmap = ({ ...props }) => {

  const dispatch = useDispatch()

  const currentlySelectedOriginPointmap = useSelector(state => state.currentlySelectedOriginPointmap)

  const destinationPanelVisibility = useSelector(state => state.destinationPanelVisibility)

  const selectByCategoryOrCodePanelVisibility = useSelector(state => state.selectByCategoryOrCodePanelVisibility)

  const selectByCode = useSelector(state => state.selectByCode)

  const selectByCategory = useSelector(state => state.selectByCategory)

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
    dispatch({ type: SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP, payload: null })
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
          destinationPanelVisibility
          ?
           (<div className='col-med' style={{height:'100vh'}}>
             <SelectionView type='pointmap-destinations'/>
           </div>)
          :
           (<>
             <div className='col-med' style={{height:'100vh',margin:'0 0 0 20px',backgroundColor:'orange'}}>
               <div>select Origins by airport code: &nbsp;</div>
               <Dropdown type='code' output='pointmap-origins'/>
               <br/>
               <div>select Origins by category: &nbsp;</div>
               <Dropdown type='category' output='pointmap-origins'/>
             </div>
           </>)
        }
        {
          selectByCategoryOrCodePanelVisibility
          ?
           (<>
              <div className='col-med' style={{margin:'0 0 0 20px',backgroundColor:'#60d7ff'}}>
                <button onClick={() => {
                    batch(() => {
                      dispatch({ type: SHOW_SELECT_BY_CODE })
                      dispatch({ type: HIDE_SELECT_BY_CATEGORY })
                    })
                  }}>Select By Code</button>
                <br/>
                <br/>
                <button onClick={() => {
                    batch(() => {
                      dispatch({ type: SHOW_SELECT_BY_CATEGORY })
                      dispatch({ type: HIDE_SELECT_BY_CODE })
                    })
                  }}>Select By Category</button>
              </div>
           </>)
          : null
        }

        {
          selectByCode == true
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
          selectByCategory == true
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
