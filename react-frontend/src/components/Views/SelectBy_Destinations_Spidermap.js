import React, { useState, useEffect } from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP,
  SHOW_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP,
} from '../../constants/spidermap'
import '../Buttons/buttons.scss'

const SelectBy_Destinations_Spidermap = ({ ...props }) => {

  const dispatch = useDispatch()

  return (<>
    <div
      className='col-med'
      style={{
        backgroundColor: '#fff',
        padding:'35px 20px 0 20px',
        boxShadow: 'inset 10px 0 15px -10px rgba(0,0,0,0.2)',
      }}>
      {/*<div>Select by:</div>*/}
      <button
        className='select-by-button'
        onClick={() => {
          batch(() => {
            dispatch({ type: SHOW_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP })
            dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP })
          })
        }}>Category</button>
      <br/>
      <br/>
      <button
        className='select-by-button'
        onClick={() => {
          batch(() => {
            dispatch({ type: SHOW_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP })
            dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP })
          })
        }}>Airport Code</button>
    </div>
  </>)

}

export default SelectBy_Destinations_Spidermap
