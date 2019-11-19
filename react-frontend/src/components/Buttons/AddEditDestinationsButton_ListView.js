import React from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_LISTVIEW,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_LISTVIEW,
} from '../../constants/listview'
import './buttons.scss'

const AddEditDestinationsButton_ListView = ({ ...props }) => {

  const dispatch = useDispatch()

  return (<>
    <button
      className='add-edit-button'
      onClick={() => {
        batch(() => {
          dispatch({ type: SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_LISTVIEW })
          dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_LISTVIEW })
        })
      }}>
      <div className='plus-symbol'>
        <div>+</div>
      </div>
      <div className='add-edit-button-text-content'>
        &nbsp;&nbsp; Add / Edit Destinations
      </div>
    </button>
  </>)

}

export default AddEditDestinationsButton_ListView
