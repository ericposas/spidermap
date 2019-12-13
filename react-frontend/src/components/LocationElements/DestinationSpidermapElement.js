import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { REMOVE_A_DESTINATION_SPIDERMAP } from '../../constants/spidermap'
import '../Buttons/buttons.scss'

const DestinationSpidermapElement = ({ ...props }) => {

  const dispatch = useDispatch()

  const removeElementHandler = () => {
    const { destinationObject, clearFilter } = props
    clearFilter()
    dispatch({ type: REMOVE_A_DESTINATION_SPIDERMAP, payload: destinationObject })
  }

  return (
    <>
      <div>
        <div style={{
              display:'inline-block'
            }}>
          {props.code} - {props.destinationObject.city} - {props.destinationObject.region} &nbsp;
        </div>
        <div className='x-button' style={{display:'inline-block'}} onClick={removeElementHandler}>
          <div className='x-button-x-symbol'>&#10005;</div>
        </div>
      </div>
    </>
  )

}

export default DestinationSpidermapElement
