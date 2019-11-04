import React from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS,
  HIDE_SELECT_BY_CATEGORY_ORIGINS,
  HIDE_SELECT_BY_CODE_ORIGINS
} from '../../constants/constants'

const AddEditDestinationsButton = ({ ...props }) => {

  const dispatch = useDispatch()

  return (<button onClick={() => {
    batch(() => {
      dispatch({ type: SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS })
      dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS })
      dispatch({ type: HIDE_SELECT_BY_CATEGORY_ORIGINS })
      dispatch({ type: HIDE_SELECT_BY_CODE_ORIGINS })
    })
  }}>+ Add / Edit Destinations</button>)

}

export default AddEditDestinationsButton
