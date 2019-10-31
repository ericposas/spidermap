import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'

const SelectionView = ({ ...props }) => {

  const selectedLocations = useSelector(state => state.selectedLocations)

  return (
    <>
      <br/>
      <br/>
      <div>Selection View</div>
      <div>
        {
          selectedLocations
          ? selectedLocations.map(location => (<Fragment key={location.id}><div>{location.code}</div></Fragment>))
          : null
        }
      </div>
    </>
  )

}

export default SelectionView
