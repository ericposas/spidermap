import {
  SHOW_SELECT_BY_CATEGORY_DESTINATIONS_LISTVIEW,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_LISTVIEW
} from '../../constants/listview'

const listview_selectByCategoryDestinations = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CATEGORY_DESTINATIONS_LISTVIEW:
      return true
      break;
    case HIDE_SELECT_BY_CATEGORY_DESTINATIONS_LISTVIEW:
      return false
      break;
    default:
      return state
  }
}

export default listview_selectByCategoryDestinations
