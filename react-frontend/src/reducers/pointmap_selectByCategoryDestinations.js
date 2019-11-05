import {
  SHOW_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP
} from '../constants/constants'

const pointmap_selectByCategoryDestinations = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP:
      return true
      break;
    case HIDE_SELECT_BY_CATEGORY_DESTINATIONS_POINTMAP:
      return false
      break;
    default:
      return state
  }
}

export default pointmap_selectByCategoryDestinations
