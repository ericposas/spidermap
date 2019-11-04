import {
  SHOW_DESTINATION_PANEL,
  HIDE_DESTINATION_PANEL
} from '../constants/constants'

const destinationPanelVisibility = (state = false, action) => {
  switch (action.type) {
    case SHOW_DESTINATION_PANEL:
      return true
      break;
    case HIDE_DESTINATION_PANEL:
      return false
      break;
    default:
      return state
  }
}

export default destinationPanelVisibility
