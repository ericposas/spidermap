import {
  SHOW_SELECT_BY_CATEGORY_DESTINATIONS,
  HIDE_SELECT_BY_CATEGORY_DESTINATIONS
} from '../constants/constants'

const selectByCategoryDestinations = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CATEGORY_DESTINATIONS:
      return true
      break;
    case HIDE_SELECT_BY_CATEGORY_DESTINATIONS:
      return false
      break;
    default:
      return state
  }
}

export default selectByCategoryDestinations
