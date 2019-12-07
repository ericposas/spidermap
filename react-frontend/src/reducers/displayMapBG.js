import {
  DISPLAY_MAP_BG,
  HIDE_MAP_BG,
} from '../constants/constants'

const displayMapBG = (state = true, action) => {

  switch (action.type) {
    case DISPLAY_MAP_BG:
      return true
      break;
    case HIDE_MAP_BG:
      return false
      break;
    default:
      return state
  }

}

export default displayMapBG
