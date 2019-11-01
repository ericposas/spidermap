import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { REMOVE_A_DESTINATION_SPIDERMAP } from '../../constants/constants'

const DestinationPointmapElement = ({ ...props }) => {

  const dispatch = useDispatch()

  const removeElementHandler = () => {
    const { destinationObject } = props
    dispatch({ type: REMOVE_A_DESTINATION_SPIDERMAP, payload: destinationObject })
  }

  const xBtnStyle = {
    display:'inline-block',fontFamily:'arial',margin:'0 0 0 6px',
    fontSize:'.75rem',borderRadius:'10px',backgroundColor:'lightblue',
    width:'1rem',textAlign:'center',padding:'2px'
  }

  return (
    <>
      <div>
        <div style={{display:'inline-block'}}>{props.code}</div>
        <div style={xBtnStyle} onClick={removeElementHandler}>X</div>
      </div>
    </>
  )

}

export default DestinationPointmapElement
