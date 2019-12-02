import {
  SET_MY_MAPS
} from '../constants/constants'

const myMaps = (state = null, action) => {
  switch (action.type) {
    case SET_MY_MAPS:
      return action.payload;
      break;
    default:
      return state
  }
}

export default myMaps
