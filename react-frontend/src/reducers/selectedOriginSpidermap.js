import { SET_ORIGIN_SPIDERMAP } from '../constants/constants'

const selectedOriginSpidermap = (state = [], action) => {
  switch (action.type) {
    case SET_ORIGIN_SPIDERMAP:
      return action.payload
      break;
    default:
      return state
  }
}

export default selectedOriginSpidermap
