import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SelectionView from '../Views/SelectionView'
import Dropdown from '../Dropdowns/Dropdown'
import { checkAuth } from '../../sessionStore'
import { LAST_LOCATION } from '../../constants/constants'

const ListView = ({ ...props }) => {

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
    dispatch({ type: LAST_LOCATION, payload: 'listview' })
  }

  return (
    <>
      <button style={{margin:'2px'}}
              className='button-plain'
              onClick={backButtonHandler}>Back</button>
      <br/>
      <br/>
      <div>Create a List View of Destinations</div>
      {/* }<div style={{display:'inline-block'}}>select Origins by airport code: &nbsp;</div>
      <Dropdown type='code' output='origins'/>
      <br/>
      <div style={{display:'inline-block'}}>select Origins by category: &nbsp;</div>
      <Dropdown type='category' output='origins'/>
      <br/> */}
      <br/>
      <div style={{display:'inline-block'}}>select Destinations by airport code: &nbsp;</div>
      <Dropdown type='code' output='listview-destinations'/>
      <br/>
      <div style={{display:'inline-block'}}>select Destinations by category: &nbsp;</div>
      <Dropdown type='category' output='listview-destinations'/>
      <br/>
      <br/>
      {/* <SelectionView type='origins'/> */}
      <SelectionView type='listview-destinations'/>
    </>
  )

}

export default withRouter(ListView)
