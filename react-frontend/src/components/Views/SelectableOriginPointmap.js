import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP } from '../../constants/constants'

const SelectableOriginPointmap = ({ ...props }) => {

  const defaultStyle = { color: 'black', fontFamily: 'arial' }

  const selectedStyle = { color: 'darkblue', fontFamily: 'arial', backgroundColor: 'lightblue', border: '2px solid darkblue', display: 'inline-block' }

  const dispatch = useDispatch()

  const currentlySelectedOriginPointmap = useSelector(state => state.currentlySelectedOriginPointmap)

  const selectedOriginsPointmap = useSelector(state => state.selectedOriginsPointmap)

  const [selectedOriginCode, setSelectedOriginCode] = useState(null)

  const setCurrentSelectedOriginPointmap = () => {
    setSelectedOriginCode(props.code)
    dispatch({ type: SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP, payload: props.code })
  }

  return (
    <>
      <div style={
        selectedOriginCode == currentlySelectedOriginPointmap
        ? selectedStyle
        : defaultStyle
      } onClick={setCurrentSelectedOriginPointmap}>{props.code}</div>
    </>
  )

}

export default SelectableOriginPointmap
