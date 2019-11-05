import React from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_SPIDERMAP,
} from '../../constants/spidermap'

const AddEditDestinationsButton_Spidermap = ({ ...props }) => {

  const dispatch = useDispatch()

  return (<>
    <button onClick={() => {
      batch(() => {
        dispatch({ type: SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_SPIDERMAP })
        dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_SPIDERMAP })
      })
    }}>+ Add / Edit Destinations</button>
  </>)

}

export default AddEditDestinationsButton_Spidermap
