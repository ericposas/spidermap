import React, { useState, useEffect } from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP,
  SHOW_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP,
} from '../../constants/spidermap'

const SelectBy_Destinations_Spidermap = ({ ...props }) => {

  const dispatch = useDispatch()

  return (<>
    <div className='col-med' style={{margin:'0 0 0 20px',backgroundColor:'#60d7ff'}}>
      <div>Spidermap</div>
      <button onClick={() => {
          batch(() => {
            dispatch({ type: SHOW_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP })
            dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP })
          })
        }}>Select Destination(s) By Code</button>
      <br/>
      <br/>
      <button onClick={() => {
          batch(() => {
            dispatch({ type: SHOW_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP })
            dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP })
          })
        }}>Select Destination(s) By Category</button>
    </div>
  </>)

}

export default SelectBy_Destinations_Spidermap
