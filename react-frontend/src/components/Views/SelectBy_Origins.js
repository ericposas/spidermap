import React, { useState } from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CODE_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CODE_ORIGINS_POINTMAP,
  SHOW_SELECT_BY_CATEGORY_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP
} from '../../constants/constants'

const SelectBy_Origins = ({ ...props }) => {

  const dispatch = useDispatch()

  return (
    <>
      <div className='col-med' style={{margin:'0 0 0 20px',backgroundColor:'#60d7ff'}}>
        <button onClick={() => {
            batch(() => {
              dispatch({ type: SHOW_SELECT_BY_CODE_ORIGINS_POINTMAP })
              dispatch({ type: HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP })
            })
          }}>Select Origin(s) By Code</button>
        <br/>
        <br/>
        <button onClick={() => {
            batch(() => {
              dispatch({ type: SHOW_SELECT_BY_CATEGORY_ORIGINS_POINTMAP })
              dispatch({ type: HIDE_SELECT_BY_CODE_ORIGINS_POINTMAP })
            })
          }}>Select Origin(s) By Category</button>
      </div>
    </>
  )

}

export default SelectBy_Origins
