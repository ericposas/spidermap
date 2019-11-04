import {
  SHOW_SELECT_BY_CATEGORY_ORIGINS,
  HIDE_SELECT_BY_CATEGORY_ORIGINS
} from '../constants/constants'

const selectByCategoryOrigins = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CATEGORY_ORIGINS:
      return true
      break;
    case HIDE_SELECT_BY_CATEGORY_ORIGINS:
      return false
      break;
    default:
      return state
  }
}

export default selectByCategoryOrigins
