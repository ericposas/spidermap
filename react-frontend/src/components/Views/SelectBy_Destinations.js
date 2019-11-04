import React, { useState } from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CODE_DESTINATIONS,
  HIDE_SELECT_BY_CODE_DESTINATIONS,
  SHOW_SELECT_BY_CATEGORY_DESTINATIONS,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS
} from '../../constants/constants'

const SelectBy_Destinations = ({ ...props }) => {

  const dispatch = useDispatch()

  return (
    <>
      <div className='col-med' style={{margin:'0 0 0 20px',backgroundColor:'#60d7ff'}}>
        <button onClick={() => {
            batch(() => {
              dispatch({ type: SHOW_SELECT_BY_CODE_DESTINATIONS })
              dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS })
            })
          }}>Select Destination(s) By Code</button>
        <br/>
        <br/>
        <button onClick={() => {
            batch(() => {
              dispatch({ type: SHOW_SELECT_BY_CATEGORY_DESTINATIONS })
              dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS })
            })
          }}>Select Destination(s) By Category</button>
      </div>
    </>
  )

}

export default SelectBy_Destinations
