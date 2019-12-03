import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CODE_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP,
  SHOW_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP,
} from '../../constants/pointmap'

const SelectBy_Destinations_Pointmap = ({ ...props }) => {

  const dispatch = useDispatch()

  const pointmap_selectByCategoryDestinations = useSelector(state => state.pointmap_selectByCategoryDestinations)

  const pointmap_selectByCodeDestinations = useSelector(state => state.pointmap_selectByCodeDestinations)

  return (<>
    <div>
      <div style={{ marginLeft: '20px' }}>
        <button
          style={{
            display: 'inline-block',
            border: pointmap_selectByCodeDestinations ? 'none' : '1px solid #ccc',
            backgroundColor: pointmap_selectByCodeDestinations ? '#37ACF4' : '#fff',
            color: pointmap_selectByCodeDestinations ? '#fff' : '#666',
            borderRadius: '2px',
          }}
          className='select-by-button'
          onClick={() => {
            batch(() => {
              dispatch({ type: SHOW_SELECT_BY_CODE_DESTINATIONS_POINTMAP })
              dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP })
            })
          }}>
          Airport Code
        </button>
        <button
          style={{
            display: 'inline-block',
            border: pointmap_selectByCategoryDestinations ? 'none' : '1px solid #ccc',
            backgroundColor: pointmap_selectByCategoryDestinations ? '#37ACF4' : '#fff',
            color: pointmap_selectByCategoryDestinations ? '#fff' : '#666',
            borderRadius: '2px',
          }}
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
    </div>
  </>)

}

export default SelectBy_Destinations_Pointmap
