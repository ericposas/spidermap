import React from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP,
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP,
  HIDE_DESTINATION_PANEL_POINTMAP,
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_SPIDERMAP,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP,
  HIDE_DESTINATION_PANEL_SPIDERMAP,
} from '../../constants/constants'

const AddEditOriginsButton = ({ ...props }) => {

  const dispatch = useDispatch()

  return (<>
    {
      props.type == 'pointmap'
      ?
        (<button onClick={() => {
          batch(() => {
            dispatch({ type: SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP, payload: null })
            dispatch({ type: SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_POINTMAP })
            dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_POINTMAP })
            dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP })
            dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP })
            dispatch({ type: HIDE_DESTINATION_PANEL_POINTMAP })
          })
        }}>+ Add / Edit Origins</button>)
      :
        (<button onClick={() => {
          batch(() => {
            dispatch({ type: SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_SPIDERMAP })
            dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_SPIDERMAP })
            dispatch({ type: HIDE_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP })
            dispatch({ type: HIDE_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP })
            dispatch({ type: HIDE_DESTINATION_PANEL_SPIDERMAP })
          })
        }}>+ Add / Edit Origins</button>)
      }
    </>)
}

export default AddEditOriginsButton
