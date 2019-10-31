import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'

const SelectionView = ({ ...props }) => {

  const selectedOrigin = useSelector(state => state.selectedOrigin)

  const selectedOrigins = useSelector(state => state.selectedOrigins)

  const selectedDestinations = useSelector(state => state.selectedDestinations)

  const label = () => {
    switch (props.type) {
      case 'origin':
        return (<><div>Origin</div></>)
        break;
      case 'origins':
        return (<><div>Origins</div></>)
        break;
      case 'destinations':
        return (<><div>Destinations</div></>)
        break;
      default:
        return (<><div>Selection View</div></>)
    }
  }

  return (
    <>
      <br/>
      <br/>
      <div>{label()}</div>
      <div>
        {
          (props.type == 'origin' && selectedOrigin)
          ? (<Fragment key={selectedOrigin.id}><div>{selectedOrigin.code}</div></Fragment>)
          : null
        }
        {
          (props.type == 'origins' && selectedOrigins)
          ? selectedOrigins.map(location => (<Fragment key={location.id}><div>{location.code}</div></Fragment>))
          : null
        }
        {
          (props.type == 'destinations' && selectedDestinations)
          ? selectedDestinations.map(location => (<Fragment key={location.id}><div>{location.code}</div></Fragment>))
          : null
        }
      </div>
    </>
  )

}

export default SelectionView
