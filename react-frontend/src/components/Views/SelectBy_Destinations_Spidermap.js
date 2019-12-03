import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP,
  SHOW_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP,
} from '../../constants/spidermap'
import '../Buttons/buttons.scss'

const SelectBy_Destinations_Spidermap = ({ ...props }) => {

  const dispatch = useDispatch()

  const spidermap_selectByCodeDestinations = useSelector(state => state.spidermap_selectByCodeDestinations)

  const spidermap_selectByCategoryDestinations = useSelector(state => state.spidermap_selectByCategoryDestinations)
  
  return (<>
    <div>
      <div style={{ marginLeft: '20px' }}>
        <button
          style={{
            display: 'inline-block',
            border: spidermap_selectByCodeDestinations ? 'none' : '1px solid #ccc',
            backgroundColor: spidermap_selectByCodeDestinations ? '#37ACF4' : '#fff',
            color: spidermap_selectByCodeDestinations ? '#fff' : '#666',
            borderRadius: '2px',
          }}
          className='select-by-button'
          onClick={() => {
            batch(() => {
              dispatch({ type: SHOW_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP })
              dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP })
            })
          }}>
          Airport Code
        </button>
        <button
          style={{
            display: 'inline-block',
            border: spidermap_selectByCategoryDestinations ? 'none' : '1px solid #ccc',
            backgroundColor: spidermap_selectByCategoryDestinations ? '#37ACF4' : '#fff',
            color: spidermap_selectByCategoryDestinations ? '#fff' : '#666',
            borderRadius: '2px',
          }}
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
    </div>
  </>)

}

export default SelectBy_Destinations_Spidermap
