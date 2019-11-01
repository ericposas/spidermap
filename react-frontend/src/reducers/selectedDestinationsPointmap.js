import { SET_DESTINATION_LOCATIONS_POINTMAP } from '../constants/constants'

const selectedDestinationsPointmap = (state = {}, action) => {
  switch (action.type) {
    case SET_DESTINATION_LOCATIONS_POINTMAP:
      let { origin, item } = action.payload
      let newState = Object.assign({}, state)
      if (!newState[origin]) newState[origin] = []
      newState[origin] = newState[origin].concat(item)
      return newState
      break;
    default:
      return state
  }
}

export default selectedDestinationsPointmap
