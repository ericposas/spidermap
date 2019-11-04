import {
  SHOW_SELECT_BY_CATEGORY,
  HIDE_SELECT_BY_CATEGORY
} from '../constants/constants'

const selectByCategory = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CATEGORY:
      return true
      break;
    case HIDE_SELECT_BY_CATEGORY:
      return false
      break;
    default:
      return state
  }
}

export default selectByCategory
