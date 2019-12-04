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
      <div style={{ marginLeft: '1px' }}>
        <button
          style={{
            display: 'inline-block',
            color: listview_selectByCodeDestinations ? '#006CC4' : '#ccc',
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
        <span>|</span>
        <button
          style={{
            display: 'inline-block',
            color: listview_selectByCategoryDestinations ? '#006CC4' : '#ccc',
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
        <div style={{ paddingBottom: '5px' }}></div>
      </div>
    </div>
  </>)

}

export default SelectBy_Destinations_ListView
