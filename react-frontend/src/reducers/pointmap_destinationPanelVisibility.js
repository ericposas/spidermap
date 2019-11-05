import {
  SHOW_DESTINATION_PANEL_POINTMAP,
  HIDE_DESTINATION_PANEL_POINTMAP
} from '../constants/constants'

const pointmap_destinationPanelVisibility = (state = false, action) => {
  switch (action.type) {
    case SHOW_DESTINATION_PANEL_POINTMAP:
      return true
      break;
    case HIDE_DESTINATION_PANEL_POINTMAP:
      return false
      break;
    default:
      return state
  }
}

export default pointmap_destinationPanelVisibility
