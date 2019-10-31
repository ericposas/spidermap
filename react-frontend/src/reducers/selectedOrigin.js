import { SET_ORIGIN } from '../constants/constants'

const selectedOrigin = (state = [], action) => {
  switch (action.type) {
    case SET_ORIGIN:
      return action.payload
      break;
    default:
      return state
  }
}

export default selectedOrigin
