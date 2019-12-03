import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CODE_DESTINATIONS_LISTVIEW,
  HIDE_SELECT_BY_CODE_DESTINATIONS_LISTVIEW,
  SHOW_SELECT_BY_CATEGORY_DESTINATIONS_LISTVIEW,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_LISTVIEW,
} from '../../constants/listview'

const SelectBy_Destinations_ListView = ({ ...props }) => {

  const dispatch = useDispatch()

  const listview_selectByCategoryDestinations = useSelector(state => state.listview_selectByCategoryDestinations)

  const listview_selectByCodeDestinations = useSelector(state => state.listview_selectByCodeDestinations)

  return (<>
    <div>
      <div style={{ marginLeft: '20px' }}>
        <button
          style={{
            display: 'inline-block',
            border: listview_selectByCodeDestinations ? 'none' : '1px solid #ccc',
            backgroundColor: listview_selectByCodeDestinations ? '#37ACF4' : '#fff',
            color: listview_selectByCodeDestinations ? '#fff' : '#666',
            borderRadius: '2px',
          }}
          className='select-by-button'
          onClick={() => {
            batch(() => {
              dispatch({ type: SHOW_SELECT_BY_CODE_DESTINATIONS_LISTVIEW })
              dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_LISTVIEW })
            })
          }}>
          Airport Code
        </button>
        <button
          style={{
            display: 'inline-block',
            border: listview_selectByCategoryDestinations ? 'none' : '1px solid #ccc',
            backgroundColor: listview_selectByCategoryDestinations ? '#37ACF4' : '#fff',
            color: listview_selectByCategoryDestinations ? '#fff' : '#666',
            borderRadius: '2px',
          }}
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
    </div>
  </>)

}

export default SelectBy_Destinations_ListView
