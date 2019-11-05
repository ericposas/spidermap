import {
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_POINTMAP
} from '../constants/constants'

const pointmap_selectBy_DestinationsVisibility = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_POINTMAP:
      return true
      break;
    case HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_POINTMAP:
      return false
      break;
    default:
      return state
  }
}

export default pointmap_selectBy_DestinationsVisibility
