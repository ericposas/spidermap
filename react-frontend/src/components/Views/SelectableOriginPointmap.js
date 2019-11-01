import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP,
  REMOVE_AN_ORIGIN_FOR_POINTMAP,
  REMOVE_DESTINATIONS_FOR_AN_ORIGIN_FOR_POINTMAP
} from '../../constants/constants'
import _ from 'lodash'

const SelectableOriginPointmap = ({ ...props }) => {

  const defaultStyle = { color: 'black', fontFamily: 'arial', display: 'inline-block' }

  const selectedStyle = { color: 'darkblue', fontFamily: 'arial', backgroundColor: 'lightblue', border: '2px solid darkblue', display: 'inline-block' }

  const dispatch = useDispatch()

  const currentlySelectedOriginPointmap = useSelector(state => state.currentlySelectedOriginPointmap)

  const selectedOriginsPointmap = useSelector(state => state.selectedOriginsPointmap)

  const [selectedOriginCode, setSelectedOriginCode] = useState(null)

  const setCurrentSelectedOriginPointmap = () => {
    setSelectedOriginCode(props.code)
    dispatch({ type: SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP, payload: props.code })
  }

  const removeElementHandler = () => {
    if (selectedOriginsPointmap && _.some(selectedOriginsPointmap, props.originObject) == true) {
      dispatch({ type: REMOVE_AN_ORIGIN_FOR_POINTMAP, payload: props.originObject })
      dispatch({ type: REMOVE_DESTINATIONS_FOR_AN_ORIGIN_FOR_POINTMAP, payload: props.code })
    }
    if (currentlySelectedOriginPointmap == props.originObject.code) {
      dispatch({ type: SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP, payload: null })
    }
  }

  const evaluateStyle = () => {
    if (currentlySelectedOriginPointmap == null) {
      return defaultStyle
    } else if (selectedOriginCode == currentlySelectedOriginPointmap) {
      // setSelectedOriginCode('')
      return selectedStyle
    } else {
      return defaultStyle
    }
  }

  return (
    <>
      <div>
        <div style={evaluateStyle()}
             onClick={setCurrentSelectedOriginPointmap}>
          {props.code}
        </div>
        <div style={{display:'inline-block',fontFamily:'arial',
          margin:'0 0 0 6px',fontSize:'.75rem',borderRadius:'10px',
          backgroundColor:'lightblue',width:'1rem',textAlign:'center',
          padding:'2px'}} onClick={removeElementHandler}>X</div>
      </div>
    </>
  )

}

export default SelectableOriginPointmap
