import { SET_ORIGIN_LOCATIONS } from '../constants/constants'

const selectedOrigins = (state = [], action) => {
  switch (action.type) {
    case SET_ORIGIN_LOCATIONS:
      return state.concat(action.payload)
      break;
    default:
      return state
  }
}

export default selectedOrigins
