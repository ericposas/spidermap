import {
  SHOW_DESTINATION_PANEL_SPIDERMAP,
  HIDE_DESTINATION_PANEL_SPIDERMAP
} from '../constants/constants'

const spidermap_destinationPanelVisibility = (state = false, action) => {
  switch (action.type) {
    case SHOW_DESTINATION_PANEL_SPIDERMAP:
      return true
      break;
    case HIDE_DESTINATION_PANEL_SPIDERMAP:
      return false
      break;
    default:
      return state
  }
}

export default spidermap_destinationPanelVisibility
