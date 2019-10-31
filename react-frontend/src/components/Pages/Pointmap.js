import React, { useState, useEffect, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import SelectionView from '../Views/SelectionView'
import Dropdown from '../Dropdowns/Dropdown'
import { checkAuth } from '../../sessionStore'

const Pointmap = ({ ...props }) => {

  useEffect(() => {
    if (!checkAuth()) {
      setTimeout(() => props.history.push('/'))
    } else {
      console.log('user is logged in')
    }
  }, [])

  return (
    <>
      <div>Create a Point-to-Point Map</div>
      <br/>
      <br/>
      <div style={{display:'inline-block'}}>select Origins by airport code: &nbsp;</div>
      <Dropdown type='code' output='origins'/>
      <br/>
      <div style={{display:'inline-block'}}>select Origins by category: &nbsp;</div>
      <Dropdown type='category' output='origins'/>
      <br/>
      <br/>
      <div style={{display:'inline-block'}}>select Destinations by airport code: &nbsp;</div>
      <Dropdown type='code' output='destinations'/>
      <br/>
      <div style={{display:'inline-block'}}>select Destinations by category: &nbsp;</div>
      <Dropdown type='category' output='destinations'/>
      <br/>
      <br/>
      <SelectionView type='origins'/>
      <SelectionView type='destinations'/>
    </>
  )

}

export default withRouter(Pointmap)
