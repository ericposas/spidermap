import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import {
  SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP,
  REMOVE_AN_ORIGIN_FOR_POINTMAP,
  REMOVE_ALL_DESTINATIONS_FOR_AN_ORIGIN_FOR_POINTMAP,
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_POINTMAP,
  SHOW_DESTINATION_PANEL_POINTMAP,
  HIDE_SELECT_BY_CODE_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_POINTMAP
} from '../../constants/pointmap'
import _ from 'lodash'
import '../Buttons/buttons.scss'

const SelectableOriginPointmapElement = ({ ...props }) => {

  const defaultStyle = {
    cursor: 'pointer',
    color: 'black',
    fontFamily: 'arial',
    display: 'inline-block',
    textAlign: 'center',
    margin: '0 6px 0 0',
  }

  const selectedStyle = {
    cursor: 'pointer',
    color: '#fff',
    fontFamily: 'arial',
    backgroundColor: '#37ACF4',
    border: '2px solid #006CC4',
    display: 'inline-block',
    textAlign: 'center',
    borderRadius: '3px',
    padding: '0 4px 0 4px',
    margin: '0 6px 0 0',
  }

  const dispatch = useDispatch()

  const currentlySelectedOriginPointmap = useSelector(state => state.currentlySelectedOriginPointmap)

  const selectedOriginsPointmap = useSelector(state => state.selectedOriginsPointmap)

  const selectedDestinationsPointmap = useSelector(state => state.selectedDestinationsPointmap)

  const [selectedOriginCode, setSelectedOriginCode] = useState(null)

  const setCurrentSelectedOriginPointmap = () => {
    setSelectedOriginCode(props.code)
    batch(() => {
      dispatch({ type: SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP, payload: props.code })
      dispatch({ type: SHOW_DESTINATION_PANEL_POINTMAP })
      dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP })
      dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP })
      dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_POINTMAP })
      dispatch({ type: HIDE_SELECT_BY_CODE_ORIGINS_POINTMAP })
      dispatch({ type: HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP })
      dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_POINTMAP })
    })
  }

  const removeElementHandler = () => {
    if (selectedOriginsPointmap && _.some(selectedOriginsPointmap, props.originObject) == true) {
      batch(() => {
        dispatch({ type: REMOVE_AN_ORIGIN_FOR_POINTMAP, payload: props.originObject })
        dispatch({ type: REMOVE_ALL_DESTINATIONS_FOR_AN_ORIGIN_FOR_POINTMAP, payload: props.code })
      })
    }
    // if (currentlySelectedOriginPointmap == props.originObject.code) {
      // dispatch({ type: SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP, payload: null })
    // }
  }

  const evaluateStyle = () => {
    if (currentlySelectedOriginPointmap == null) {
      return defaultStyle
    } else if (selectedOriginCode == currentlySelectedOriginPointmap) {
      return selectedStyle
    } else if (currentlySelectedOriginPointmap == props.originObject.code) {
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
          { props.code } - { props.originObject.city } - {props.originObject.region}
          {
            selectedDestinationsPointmap && selectedDestinationsPointmap[props.code]
            ? <span>&nbsp;&#91;{selectedDestinationsPointmap[props.code].length}&#93;</span>
            : <span>&nbsp;&#91;0&#93;</span>
          }
        </div>
        <div style={{ display: 'inline-block' }}
             className='x-button'
             onClick={removeElementHandler}>
          <div className='x-button-x-symbol'>
            x
          </div>
        </div>
      </div>
    </>
  )

}

export default SelectableOriginPointmapElement
