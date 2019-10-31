import { SET_ORIGIN_LOCATIONS_POINTMAP } from '../constants/constants'

const selectedOriginsPointmap = (state = [], action) => {
  switch (action.type) {
    case SET_ORIGIN_LOCATIONS_POINTMAP:
      return state.concat(action.payload)
      break;
    default:
      return state
  }
}

export default selectedOriginsPointmap
