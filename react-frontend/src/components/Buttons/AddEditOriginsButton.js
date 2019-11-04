import React from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP,
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS,
  HIDE_SELECT_BY_CODE_DESTINATIONS,
  HIDE_DESTINATION_PANEL,
} from '../../constants/constants'

const AddEditOriginsButton = ({ ...props }) => {

  const dispatch = useDispatch()

  return (<button onClick={() => {
    batch(() => {
      dispatch({ type: SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP, payload: null })
      dispatch({ type: SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS })
      dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS })
      dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS })
      dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS })
      dispatch({ type: HIDE_DESTINATION_PANEL })
    })
  }}>+ Add / Edit Origins</button>)

}

export default AddEditOriginsButton
