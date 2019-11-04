import {
  SHOW_SELECT_BY_CODE,
  HIDE_SELECT_BY_CODE
} from '../constants/constants'

const selectByCode = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CODE:
      return true
      break;
    case HIDE_SELECT_BY_CODE:
      return false
      break;
    default:
      return state
  }
}

export default selectByCode
