import { SET_DESTINATION_LOCATIONS_POINTMAP } from '../constants/constants'

const selectedDestinationsPointmap = (state = [], action) => {
  switch (action.type) {
    case SET_DESTINATION_LOCATIONS_POINTMAP:
      return state.concat(action.payload)
      break;
    default:
      return state
  }
}

export default selectedDestinationsPointmap
