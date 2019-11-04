import {
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS
} from '../constants/constants'

const selectBy_DestinationsVisibility = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS:
      return true
      break;
    case HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS:
      return false
      break;
    default:
      return state
  }
}

export default selectBy_DestinationsVisibility
