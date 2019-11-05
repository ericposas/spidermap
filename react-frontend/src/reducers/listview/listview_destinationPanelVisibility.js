import {
  SHOW_DESTINATION_PANEL_LISTVIEW,
  HIDE_DESTINATION_PANEL_LISTVIEW
} from '../../constants/listview'

const listview_destinationPanelVisibility = (state = false, action) => {
  switch (action.type) {
    case SHOW_DESTINATION_PANEL_LISTVIEW:
      return true
      break;
    case HIDE_DESTINATION_PANEL_LISTVIEW:
      return false
      break;
    default:
      return state
  }
}

export default listview_destinationPanelVisibility
