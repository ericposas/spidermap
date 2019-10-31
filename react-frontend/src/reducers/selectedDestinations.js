import { SET_DESTINATION_LOCATIONS } from '../constants/constants'

const selectedDestinations = (state = [], action) => {
  switch (action.type) {
    case SET_DESTINATION_LOCATIONS:
      return state.concat(action.payload)
      break;
    default:
      return state
  }
}

export default selectedDestinations
