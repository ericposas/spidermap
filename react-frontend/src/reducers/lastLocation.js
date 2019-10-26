import { LAST_LOCATION } from '../constants/constants'

const lastLocation = (state = '', action) => {
  switch (action.type) {
    case LAST_LOCATION:
      return action.payload
      break;
    default:
      return state
  }
}

export default lastLocation
