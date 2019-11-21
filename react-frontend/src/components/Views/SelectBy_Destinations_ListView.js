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
    <div
      className='col-med'
      style={{
        backgroundColor: '#fff',
        padding:'35px 20px 0 20px',
        boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
      }}>
      <button
        className='select-by-button'
        onClick={() => {
          batch(() => {
            dispatch({ type: SHOW_SELECT_BY_CODE_DESTINATIONS_LISTVIEW })
            dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_LISTVIEW })
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
            dispatch({ type: SHOW_SELECT_BY_CATEGORY_DESTINATIONS_LISTVIEW })
            dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS_LISTVIEW })
          })
        }}>
        Category
      </button>
    </div>
  </>)

}

export default SelectBy_Destinations_ListView
