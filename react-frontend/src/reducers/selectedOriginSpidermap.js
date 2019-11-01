import { SET_ORIGIN_SPIDERMAP, REMOVE_AN_ORIGIN_SPIDERMAP } from '../constants/constants'

const selectedOriginSpidermap = (state = null, action) => {
  switch (action.type) {
    case SET_ORIGIN_SPIDERMAP:
      return action.payload
      break;
    case REMOVE_AN_ORIGIN_SPIDERMAP:
      return null
      break;
    default:
      return state
  }
}

export default selectedOriginSpidermap
