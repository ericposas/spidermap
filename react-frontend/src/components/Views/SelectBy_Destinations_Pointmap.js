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
      <div style={{ marginLeft: '1px' }}>
        <button
          style={{
            display: 'inline-block',
            color: pointmap_selectByCodeDestinations ? '#006CC4' : '#ccc',
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
        <span>|</span>
        <button
          style={{
            display: 'inline-block',
            color: pointmap_selectByCategoryDestinations ? '#006CC4' : '#ccc',
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
        <div style={{ paddingBottom: '5px' }}></div>
      </div>
    </div>
  </>)

}

export default SelectBy_Destinations_Pointmap
