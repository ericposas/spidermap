import React, { useState, useEffect } from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CODE_DESTINATIONS_LISTVIEW,
  HIDE_SELECT_BY_CODE_DESTINATIONS_LISTVIEW,
  SHOW_SELECT_BY_CATEGORY_DESTINATIONS_LISTVIEW,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_LISTVIEW,
} from '../../constants/listview'

const SelectBy_Destinations_ListView = ({ ...props }) => {

  const dispatch = useDispatch()

  return (<>
    <div className='col-med' style={{margin:'0 0 0 20px',backgroundColor:'#60d7ff'}}>
      <div>List View</div>
      <button onClick={() => {
          batch(() => {
            dispatch({ type: SHOW_SELECT_BY_CODE_DESTINATIONS_LISTVIEW })
            dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_LISTVIEW })
          })
        }}>Select Destination(s) By Code</button>
      <br/>
      <br/>
      <button onClick={() => {
          batch(() => {
            dispatch({ type: SHOW_SELECT_BY_CATEGORY_DESTINATIONS_LISTVIEW })
            dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS_LISTVIEW })
          })
        }}>Select Destination(s) By Category</button>
    </div>
  </>)

}

export default SelectBy_Destinations_ListView
