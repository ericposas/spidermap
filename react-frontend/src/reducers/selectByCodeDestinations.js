import {
  SHOW_SELECT_BY_CODE_DESTINATIONS,
  HIDE_SELECT_BY_CODE_DESTINATIONS
} from '../constants/constants'

const selectByCodeDestinations = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CODE_DESTINATIONS:
      return true
      break;
    case HIDE_SELECT_BY_CODE_DESTINATIONS:
      return false
      break;
    default:
      return state
  }
}

export default selectByCodeDestinations
