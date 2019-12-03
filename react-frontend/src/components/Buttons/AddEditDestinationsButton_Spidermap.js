import React from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP,
  // SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_SPIDERMAP,
  // HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_SPIDERMAP,
} from '../../constants/spidermap'
import './buttons.scss'

const AddEditDestinationsButton_Spidermap = ({ ...props }) => {

  const dispatch = useDispatch()

  return (<>
    <button
      className='add-edit-button'
      onClick={() => {
        batch(() => {
          dispatch({ type: SHOW_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP })
          dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP })
          // dispatch({ type: SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_SPIDERMAP })
          // dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_SPIDERMAP })
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

export default AddEditDestinationsButton_Spidermap
