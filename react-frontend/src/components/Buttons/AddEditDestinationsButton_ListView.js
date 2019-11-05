import React from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_LISTVIEW,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_LISTVIEW,
} from '../../constants/listview'

const AddEditDestinationsButton_ListView = ({ ...props }) => {

  const dispatch = useDispatch()

  return (<>
    <button onClick={() => {
      batch(() => {
        dispatch({ type: SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_LISTVIEW })
        dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_LISTVIEW })
      })
    }}>+ Add / Edit Destinations</button>
  </>)

}

export default AddEditDestinationsButton_ListView
