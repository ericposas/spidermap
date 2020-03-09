import {
  SET_SPIDERMAP_DISTLIMIT
} from '../../constants/spidermap'

const spidermap_distLimit = (state = 2000, action) => {
  switch (action.type) {
    case SET_SPIDERMAP_DISTLIMIT:
      return action.payload
      break;
    default:
      return state
  }
}

export default spidermap_distLimit
