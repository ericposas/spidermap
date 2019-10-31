import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'

const SelectionView = ({ ...props }) => {

  const selectedLocations = useSelector(state => state.selectedLocations)

  const showSelections = () => {
    // console.log(selectedLocations)
    let arr = selectedLocations.map((item, i) => (
      <Fragment key={item.id}>
        <div>{item.id} {item.code} {item.region} {item.category}</div>
      </Fragment>
    ))
    return arr
  }

  return (
    <div>
      { selectedLocations ? showSelections() : '' }
    </div>
  )

}

export default SelectionView
