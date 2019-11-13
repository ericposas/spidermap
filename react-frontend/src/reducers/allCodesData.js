import {
  SET_ALL_CODES
} from '../constants/constants'

const allCodesData = (state = null, action) => {
  switch (action.type) {
    case SET_ALL_CODES:
      return action.payload
      break;
    default:
      return state
  }
}


export default allCodesData
