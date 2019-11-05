import {
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_SPIDERMAP
} from '../../constants/spidermap'

const spidermap_selectBy_DestinationsVisibility = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_SPIDERMAP:
      return true
      break;
    case HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_DESTINATIONS_SPIDERMAP:
      return false
      break;
    default:
      return state
  }
}

export default spidermap_selectBy_DestinationsVisibility
