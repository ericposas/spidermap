import { SET_ORIGIN_LOCATIONS_POINTMAP } from '../constants/constants'

const selectedOriginsPointmap = (state = null, action) => {
  switch (action.type) {
    case SET_ORIGIN_LOCATIONS_POINTMAP:
      if (state == null) state = []
      return state.concat(action.payload)
      break;
    default:
      return state
  }
}

export default selectedOriginsPointmap
