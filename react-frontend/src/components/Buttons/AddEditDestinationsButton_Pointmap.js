import React from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CODE_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP,
  SHOW_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP,
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_POINTMAP,
} from '../../constants/pointmap'
import './buttons.scss'

const AddEditDestinationsButton_Pointmap = ({ ...props }) => {

  const dispatch = useDispatch()

  return (<>
    <button
      className='add-edit-button'
      onClick={() => {
        batch(() => {
          dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP })
          setTimeout(() => {
            dispatch({ type: SHOW_SELECT_BY_CODE_DESTINATIONS_POINTMAP })
            dispatch({ type: SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_POINTMAP })
          }, 50)
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

export default AddEditDestinationsButton_Pointmap
