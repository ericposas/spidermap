import { SET_SELECTED_LOCATIONS } from '../constants/constants'

const selectedLocations = (state = [], action) => {
  switch (action.type) {
    case SET_SELECTED_LOCATIONS:
      return state.concat(action.payload)
      break;
    default:
      return state
  }
}

export default selectedLocations
