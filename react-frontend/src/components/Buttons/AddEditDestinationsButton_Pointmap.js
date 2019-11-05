import React from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CODE_ORIGINS_POINTMAP,
} from '../../constants/pointmap'

const AddEditDestinationsButton_Pointmap = ({ ...props }) => {

  const dispatch = useDispatch()

  return (<>
    <button onClick={() => {
      batch(() => {
        dispatch({ type: SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_POINTMAP })
        dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_POINTMAP })
        dispatch({ type: HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP })
        dispatch({ type: HIDE_SELECT_BY_CODE_ORIGINS_POINTMAP })
      })
    }}>+ Add / Edit Destinations</button>
  </>)
}

export default AddEditDestinationsButton_Pointmap
