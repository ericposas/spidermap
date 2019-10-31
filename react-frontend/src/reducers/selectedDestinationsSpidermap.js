import { SET_DESTINATION_LOCATIONS_SPIDERMAP } from '../constants/constants'

const selectedDestinationsSpidermap = (state = [], action) => {
  switch (action.type) {
    case SET_DESTINATION_LOCATIONS_SPIDERMAP:
      return state.concat(action.payload)
      break;
    default:
      return state
  }
}

export default selectedDestinationsSpidermap
