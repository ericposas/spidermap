import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { REMOVE_A_DESTINATION_SPIDERMAP } from '../../constants/spidermap'
import '../Buttons/buttons.scss'

const DestinationSpidermapElement = ({ ...props }) => {

  const dispatch = useDispatch()

  const removeElementHandler = () => {
    const { destinationObject } = props
    dispatch({ type: REMOVE_A_DESTINATION_SPIDERMAP, payload: destinationObject })
  }

  return (
    <>
      <div>
        <div style={{
              display:'inline-block'
            }}>
          {props.code} &nbsp;
        </div>
        <div className='x-button' style={{display:'inline-block'}} onClick={removeElementHandler}>
          <div className='x-button-x-symbol'>x</div>
        </div>
      </div>
    </>
  )

}

export default DestinationSpidermapElement
