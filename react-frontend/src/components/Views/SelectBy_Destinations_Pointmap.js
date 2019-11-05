import React, { useState, useEffect } from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CODE_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP,
  SHOW_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP,
} from '../../constants/pointmap'

const SelectBy_Destinations_Pointmap = ({ ...props }) => {

  const dispatch = useDispatch()

  return (<>
    <div className='col-med' style={{margin:'0 0 0 20px',backgroundColor:'#60d7ff'}}>
      <div>Point-to-point map</div>
      <button onClick={() => {
          batch(() => {
          dispatch({ type: SHOW_SELECT_BY_CODE_DESTINATIONS_POINTMAP })
          dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP })
        })
      }}>Select Destination(s) By Code</button>
      <br/>
      <br/>
      <button onClick={() => {
          batch(() => {
            dispatch({ type: SHOW_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP })
            dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP })
          })
        }}>Select Destination(s) By Category</button>
    </div>
  </>)

}

export default SelectBy_Destinations_Pointmap
