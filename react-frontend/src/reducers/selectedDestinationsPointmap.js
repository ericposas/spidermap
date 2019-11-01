import {
  SET_DESTINATION_LOCATIONS_POINTMAP,
  REMOVE_DESTINATIONS_FOR_AN_ORIGIN_FOR_POINTMAP
} from '../constants/constants'

const selectedDestinationsPointmap = (state = {}, action) => {
  switch (action.type) {
    case SET_DESTINATION_LOCATIONS_POINTMAP: {
      let { origin, item } = action.payload
      let newState = Object.assign({}, state)
      if (!newState[origin]) newState[origin] = []
      newState[origin] = newState[origin].concat(item)
      return newState
    }
      break;
    case REMOVE_DESTINATIONS_FOR_AN_ORIGIN_FOR_POINTMAP: {
      let newState = Object.assign({}, state)
      delete newState[action.payload]
      return newState
    }
    default:
      return state
  }
}

export default selectedDestinationsPointmap
