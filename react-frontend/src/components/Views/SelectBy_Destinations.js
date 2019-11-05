import React, { useState, useEffect } from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CODE_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP,
  SHOW_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP,
  SHOW_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP,
  SHOW_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP
} from '../../constants/constants'

const SelectBy_Destinations = ({ ...props }) => {

  useEffect(() => {}, [])

  const dispatch = useDispatch()

  console.log(props.type)

  return (<>
      {
        props.type == 'pointmap'
        ?
          (<div className='col-med' style={{margin:'0 0 0 20px',backgroundColor:'#60d7ff'}}>
            <button onClick={() => {
                batch(() => {
                dispatch({ type: SHOW_SELECT_BY_CODE_DESTINATIONS_POINTMAP })
                dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP })
              })
            }}>Select Destination(s) By Code</button>
            <br/>
            <br/>
            <button onClick={() => {
                batch(() => {
                  dispatch({ type: SHOW_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP })
                  dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP })
                })
              }}>Select Destination(s) By Category</button>
          </div>)
        :
          (<div className='col-med' style={{margin:'0 0 0 20px',backgroundColor:'#60d7ff'}}>
            <button onClick={() => {
                batch(() => {
                  dispatch({ type: SHOW_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP })
                  dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP })
                })
              }}>Select Destination(s) By Code - Spidermap</button>
            <br/>
            <br/>
            <button onClick={() => {
                batch(() => {
                  dispatch({ type: SHOW_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP })
                  dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP })
                })
              }}>Select Destination(s) By Category - Spidermap</button>
          </div>)
      }
    </>)

}

export default SelectBy_Destinations
