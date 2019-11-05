import React from 'react'
import { useDispatch, batch } from 'react-redux'
import {
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CODE_ORIGINS_POINTMAP,
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_SPIDERMAP,
} from '../../constants/constants'

const AddEditDestinationsButton = ({ ...props }) => {

  const dispatch = useDispatch()

  return (<>
      {
        props.type == 'pointmap'
        ?
          (<button onClick={() => {
            batch(() => {
              dispatch({ type: SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_POINTMAP })
              dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_POINTMAP })
              dispatch({ type: HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP })
              dispatch({ type: HIDE_SELECT_BY_CODE_ORIGINS_POINTMAP })
            })
          }}>+ Add / Edit Destinations</button>)
        :
          (<button onClick={() => {
            batch(() => {
              dispatch({ type: SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_SPIDERMAP })
              dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_SPIDERMAP })
            })
          }}>+ Add / Edit Destinations</button>)
      }
    </>)
}

export default AddEditDestinationsButton
