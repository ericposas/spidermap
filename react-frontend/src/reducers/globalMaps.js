import {
  SET_GLOBAL_MAPS
} from '../constants/constants'

const globalMaps = (state = null, action) => {
  switch (action.type) {
    case SET_GLOBAL_MAPS:
      return action.payload;
      break;
    default:
      return state
  }
}

export default globalMaps
