import {
  SHOW_SELECT_BY_CODE_ORIGINS,
  HIDE_SELECT_BY_CODE_ORIGINS
} from '../constants/constants'

const selectByCodeOrigins = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CODE_ORIGINS:
      return true
      break;
    case HIDE_SELECT_BY_CODE_ORIGINS:
      return false
      break;
    default:
      return state
  }
}

export default selectByCodeOrigins
