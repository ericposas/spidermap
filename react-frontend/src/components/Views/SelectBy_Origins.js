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
        <div style={{ marginLeft: '1px' }}>
          <button
            style={{
              display: 'inline-block',
              color: pointmap_selectByCodeOrigins ? '#006CC4' : '#ccc',
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
          <span>|</span>
          <button
            style={{
              display: 'inline-block',
              color: pointmap_selectByCategoryOrigins ? '#006CC4' : '#ccc',
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
          <div style={{ paddingBottom: '5px' }}></div>
        </div>
      </div>
    </>
  )

}

export default SelectBy_Origins
