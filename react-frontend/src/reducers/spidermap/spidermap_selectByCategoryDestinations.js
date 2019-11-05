import {
  SHOW_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP
} from '../../constants/spidermap'

const spidermap_selectByCategoryDestinations = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP:
      return true
      break;
    case HIDE_SELECT_BY_CATEGORY_DESTINATIONS_SPIDERMAP:
      return false
      break;
    default:
      return state
  }
}

export default spidermap_selectByCategoryDestinations
