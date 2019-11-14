import {
  SET_DESTINATION_LOCATIONS_POINTMAP,
  SET_DESTINATION_LOCATIONS_POINTMAP_AT_ONCE,
  REMOVE_ALL_DESTINATIONS_FOR_AN_ORIGIN_FOR_POINTMAP,
  REMOVE_A_DESTINATION_FOR_AN_ORIGIN_FOR_POINTMAP
} from '../../constants/pointmap'

const selectedDestinationsPointmap = (state = {}, action) => {
  switch (action.type) {
    case SET_DESTINATION_LOCATIONS_POINTMAP_AT_ONCE: {
      return action.payload
    }
    case SET_DESTINATION_LOCATIONS_POINTMAP: {
      let { origin, item } = action.payload
      let newState = Object.assign({}, state)
      if (!newState[origin]) newState[origin] = []
      if (origin != item.code) newState[origin] = newState[origin].concat(item)
      return newState
    }
      break;
    case REMOVE_ALL_DESTINATIONS_FOR_AN_ORIGIN_FOR_POINTMAP: {
      let newState = Object.assign({}, state)
      delete newState[action.payload]
      return newState
    }
    case REMOVE_A_DESTINATION_FOR_AN_ORIGIN_FOR_POINTMAP: {
      let { originCode, destination } = action.payload
      let newState = Object.assign({}, state)
      if (newState[originCode]) {
        newState[originCode] = newState[originCode].filter((dest, i) => newState[originCode].indexOf(destination) != i)
      }
      return newState
    }
    default:
      return state
  }
}

export default selectedDestinationsPointmap
