import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import {
  REMOVE_ORIGIN_LISTVIEW,
  REMOVE_ALL_DESTINATIONS_LISTVIEW,
  HIDE_SELECT_BY_CODE_DESTINATIONS_LISTVIEW,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_LISTVIEW,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_LISTVIEW
} from '../../constants/listview'

const OriginListViewElement = ({ ...props }) => {

  const dispatch = useDispatch()

  const removeElementHandler = () => {
    const { originObject } = props
    batch(() => {
      dispatch({ type: REMOVE_ORIGIN_LISTVIEW, payload: originObject })
      dispatch({ type: REMOVE_ALL_DESTINATIONS_LISTVIEW })
      dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS_LISTVIEW })
      dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_LISTVIEW })
      dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_LISTVIEW })
    })
  }

  const xBtnStyle = {
    display:'inline-block',fontFamily:'arial',margin:'0 0 0 6px',
    fontSize:'.75rem',borderRadius:'10px',backgroundColor:'lightblue',
    width:'1rem',textAlign:'center',padding:'2px'
  }

  return (
    <>
      <div>
        <div style={{display:'inline-block'}}>
          {props.code} - {props.originObject.city} - {props.originObject.region}
        </div>
        <div style={xBtnStyle} onClick={removeElementHandler}>X</div>
      </div>
    </>
  )

}

export default OriginListViewElement
