import {
  SHOW_SELECT_BY_CODE_DESTINATIONS_POINTMAP,
  HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP
} from '../../constants/pointmap'

const pointmap_selectByCodeDestinations = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CODE_DESTINATIONS_POINTMAP:
      return true
      break;
    case HIDE_SELECT_BY_CODE_DESTINATIONS_POINTMAP:
      return false
      break;
    default:
      return state
  }
}

export default pointmap_selectByCodeDestinations
