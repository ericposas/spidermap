import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { REMOVE_A_DESTINATION_FOR_AN_ORIGIN_FOR_POINTMAP } from '../../constants/pointmap'

const DestinationPointmapElement = ({ ...props }) => {

  const dispatch = useDispatch()

  const [hilite, setHilite] = useState(false)

  const currentlySelectedOriginPointmap = useSelector(state => state.currentlySelectedOriginPointmap)

  const removeElementHandler = () => {
    const { destinationObject, clearFilter } = props
    clearFilter()
    dispatch({ type: REMOVE_A_DESTINATION_FOR_AN_ORIGIN_FOR_POINTMAP, payload: { originCode: currentlySelectedOriginPointmap, destination: destinationObject } })
  }

  return (
    <>
      <div>
        <div style={{
              display:'inline-block',
              color: hilite ? '#fff' : '#777',
              backgroundColor: hilite ? '#ccc' : '#fff',
            }}>
        {props.code} - {props.destinationObject.city} - {props.destinationObject.region} &nbsp;
        </div>
        <div
          className='x-button'
          style={{ display:'inline-block', float: 'right', marginRight: '4px' }}
          onClick={removeElementHandler}
          onMouseOver={() => setHilite(true)}
          onMouseOut={() => setHilite(false)}>
          <div className='x-button-x-symbol'>&#10005;</div>
        </div>
      </div>
    </>
  )

}

export default DestinationPointmapElement
