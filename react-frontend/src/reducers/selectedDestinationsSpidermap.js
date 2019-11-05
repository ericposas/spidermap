import {
  SET_DESTINATION_LOCATIONS_SPIDERMAP,
  REMOVE_A_DESTINATION_SPIDERMAP,
  REMOVE_ALL_DESTINATIONS_SPIDERMAP
} from '../constants/constants'

const selectedDestinationsSpidermap = (state = [], action) => {
  switch (action.type) {
    case SET_DESTINATION_LOCATIONS_SPIDERMAP: {
      let { origin, item } = action.payload
      if (origin.code != item.code) return state.concat(item)
      else return state
    }
      break;
    case REMOVE_A_DESTINATION_SPIDERMAP: {
      let newState = state.slice(0)
      let first = newState.slice(0, newState.indexOf(action.payload))
      let second = newState.slice(newState.indexOf(action.payload)+1, newState.length)
      newState = first.concat(second)
      return newState
    }
      break;
    case REMOVE_ALL_DESTINATIONS_SPIDERMAP: {
      return []
    }
    default:
      return state
  }
}

export default selectedDestinationsSpidermap
