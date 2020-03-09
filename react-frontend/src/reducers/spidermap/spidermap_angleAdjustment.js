import {
  SET_SPIDERMAP_ANGLEADJUST
} from '../../constants/spidermap'

const spidermap_angleAdjustment = (state = 0, action) => {
  switch (action.type) {
    case SET_SPIDERMAP_ANGLEADJUST:
      return action.payload
      break;
    default:
      return state
  }
}

export default spidermap_angleAdjustment
