import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SelectionView from '../Views/SelectionView'
import Dropdown from '../Dropdowns/Dropdown'
import { checkAuth } from '../../sessionStore'
import {
  LAST_LOCATION,
  SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP
} from '../../constants/constants'

const Pointmap = ({ ...props }) => {

  const dispatch = useDispatch()

  const currentlySelectedOriginPointmap = useSelector(state => state.currentlySelectedOriginPointmap)

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
      <div style={{display:'inline-block'}}>select Origins by airport code: &nbsp;</div>
      <Dropdown type='code' output='pointmap-origins'/>
      <br/>
      <div style={{display:'inline-block'}}>select Origins by category: &nbsp;</div>
      <Dropdown type='category' output='pointmap-origins'/>
      <br/>
      <br/>
      {
        currentlySelectedOriginPointmap
        ?
        (<>
          <div style={{display:'inline-block'}}>select Destinations by airport code: &nbsp;</div>
          <Dropdown type='code' output='pointmap-destinations'/>
          <br/>
          <div style={{display:'inline-block'}}>select Destinations by category: &nbsp;</div>
          <Dropdown type='category' output='pointmap-destinations'/>
        </>) : null
      }
      <br/>
      <br/>
      <SelectionView type='pointmap-origins'/>
      <SelectionView type='pointmap-destinations'/>
    </>
  )

}

export default withRouter(Pointmap)
