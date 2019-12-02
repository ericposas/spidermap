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
      className='col-med panel-style'
      style={{ padding:'35px 20px 0 20px' }}>
      <button
        className='select-by-button'
        onClick={() => {
          batch(() => {
            dispatch({ type: SHOW_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP })
            dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP })
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
            dispatch({ type: SHOW_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP })
            dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP })
          })
        }}>
        Category
      </button>
    </div>
  </>)

}

export default SelectBy_Destinations_Spidermap
