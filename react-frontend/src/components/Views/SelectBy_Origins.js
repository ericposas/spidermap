import React, { useState } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CODE_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CODE_ORIGINS_POINTMAP,
  SHOW_SELECT_BY_CATEGORY_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP
} from '../../constants/pointmap'

const SelectBy_Origins = ({ ...props }) => {

  const dispatch = useDispatch()

  const pointmap_selectByCodeOrigins = useSelector(state => state.pointmap_selectByCodeOrigins)

  const pointmap_selectByCategoryOrigins = useSelector(state => state.pointmap_selectByCategoryOrigins)

  return (
    <>
      <div>
        <div style={{ marginLeft: '20px' }}>
          <button
            style={{
              display: 'inline-block',
              border: pointmap_selectByCodeOrigins ? 'none' : '1px solid #ccc',
              backgroundColor: pointmap_selectByCodeOrigins ? '#37ACF4' : '#fff',
              color: pointmap_selectByCodeOrigins ? '#fff' : '#666',
              borderRadius: '2px',
            }}
            className='select-by-button'
            onClick={() => {
              batch(() => {
                dispatch({ type: SHOW_SELECT_BY_CODE_ORIGINS_POINTMAP })
                dispatch({ type: HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP })
              })
            }}>
            Airport Code
          </button>
          <button
            style={{
              display: 'inline-block',
              border: pointmap_selectByCategoryOrigins ? 'none' : '1px solid #ccc',
              backgroundColor: pointmap_selectByCategoryOrigins ? '#37ACF4' : '#fff',
              color: pointmap_selectByCategoryOrigins ? '#fff' : '#666',
              borderRadius: '2px',
            }}
            className='select-by-button'
            onClick={() => {
              batch(() => {
                dispatch({ type: SHOW_SELECT_BY_CATEGORY_ORIGINS_POINTMAP })
                dispatch({ type: HIDE_SELECT_BY_CODE_ORIGINS_POINTMAP })
              })
            }}>
            Category
          </button>
        </div>
      </div>
    </>
  )

}

export default SelectBy_Origins
