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
    <div
      className='col-med'
      style={{
        backgroundColor: '#fff',
        padding:'35px 20px 0 20px',
        boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
      }}>
      {/*<div>Point-to-point map</div>*/}
      <button
        className='select-by-button'
        onClick={() => {
          batch(() => {
            dispatch({ type: SHOW_SELECT_BY_CODE_DESTINATIONS_POINTMAP })
            dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP })
          })
        }}>
        Airport Code
      </button>
      <br/>
      <br/>
      <button
        className='select-by-button'
        onClick={() => {
          batch(() => {
            dispatch({ type: SHOW_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP })
            dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP })
          })
        }}>
        Category
      </button>
    </div>
  </>)

}

export default SelectBy_Destinations_Pointmap
