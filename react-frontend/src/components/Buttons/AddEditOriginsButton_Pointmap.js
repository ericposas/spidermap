import React from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  HIDE_DESTINATION_PANEL_POINTMAP,
  HIDE_SELECT_BY_CODE_ORIGINS_POINTMAP,
  SHOW_SELECT_BY_CODE_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP,
  SHOW_SELECT_BY_CATEGORY_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP,
  SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP,
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_POINTMAP,
} from '../../constants/pointmap'
import './buttons.scss'

const AddEditOriginsButton_Pointmap = ({ ...props }) => {

  const dispatch = useDispatch()

  return (<>
    <button
      className='add-edit-button'
      onClick={() => {
        batch(() => {
          dispatch({ type: SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP, payload: null })
          dispatch({ type: SHOW_SELECT_BY_CODE_ORIGINS_POINTMAP })
          dispatch({ type: HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP })
          dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP })
          dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP })
          dispatch({ type: HIDE_DESTINATION_PANEL_POINTMAP })
          setTimeout(() => {
            dispatch({ type: SHOW_SELECT_BY_CODE_ORIGINS_POINTMAP })
            dispatch({ type: SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_POINTMAP })
          }, 50)
        })
      }}>
    <div className='plus-symbol'>
      <div>+</div>
    </div>
    <div className='add-edit-button-text-content'>
      &nbsp;&nbsp; Add / Edit Origins
    </div>
  </button>
  </>)

}

export default AddEditOriginsButton_Pointmap
