import React, { useState } from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CODE_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CODE_ORIGINS_POINTMAP,
  SHOW_SELECT_BY_CATEGORY_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP
} from '../../constants/pointmap'

const SelectBy_Origins = ({ ...props }) => {

  const dispatch = useDispatch()

  return (
    <>
      <div
        className='col-med panel-style'
        style={{ padding:'35px 20px 0 20px' }}>
        <button
            className='select-by-button'
            onClick={() => {
              batch(() => {
                dispatch({ type: SHOW_SELECT_BY_CODE_ORIGINS_POINTMAP })
                dispatch({ type: HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP })
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
                dispatch({ type: SHOW_SELECT_BY_CATEGORY_ORIGINS_POINTMAP })
                dispatch({ type: HIDE_SELECT_BY_CODE_ORIGINS_POINTMAP })
              })
            }}>
          Category
        </button>
      </div>
    </>
  )

}

export default SelectBy_Origins
