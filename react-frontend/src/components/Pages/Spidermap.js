import React, { Fragment, useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import SelectionView from '../Views/SelectionView'
import Dropdown from '../Dropdowns/Dropdown'
import { checkAuth } from '../../sessionStore'

const Spidermap = ({ ...props }) => {

  useEffect(() => {
    if (!checkAuth()) {
      setTimeout(() => props.history.push('/'))
    } else {
      console.log('user is logged in')
    }
  }, [])

  return (
    <>
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
