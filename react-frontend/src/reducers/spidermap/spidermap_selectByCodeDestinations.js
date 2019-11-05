import {
  SHOW_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP,
  HIDE_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP
} from '../../constants/spidermap'

const spidermap_selectByCodeDestinations = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP:
      return true
      break;
    case HIDE_SELECT_BY_CODE_DESTINATIONS_SPIDERMAP:
      return false
      break;
    default:
      return state
  }
}

export default spidermap_selectByCodeDestinations
