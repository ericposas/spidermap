import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SelectionView from '../Views/SelectionView'
import Dropdown from '../Dropdowns/Dropdown'
import { checkAuth } from '../../sessionStore'
import { LAST_LOCATION } from '../../constants/constants'

const Spidermap = ({ ...props }) => {

  const dispatch = useDispatch()

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
      <div>Create a Spidermap</div>
      <br/>
      <br/>
      <div style={{display:'inline-block'}}>select Origin by airport code: &nbsp;</div>
      <Dropdown type='code' output='origin'/>
      <br/>
      <br/>
      <div style={{display:'inline-block'}}>select Destinations by code: &nbsp;</div>
      <Dropdown type='code' output='destinations'/>
      <br/>
      <div style={{display:'inline-block'}}>select Destinations by category: &nbsp;</div>
      <Dropdown type='category' output='destinations'/>
      <br/>
      <br/>
      <SelectionView type='origin'/>
      <SelectionView type='destinations'/>
    </>
  )

}

export default withRouter(Spidermap)
