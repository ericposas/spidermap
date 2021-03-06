import {
  SET_ORIGIN_LOCATIONS_POINTMAP,
  REMOVE_AN_ORIGIN_FOR_POINTMAP,
  CLEAR_ORIGIN_LOCATIONS_POINTMAP
} from '../../constants/pointmap'

const selectedOriginsPointmap = (state = null, action) => {
  switch (action.type) {
    case CLEAR_ORIGIN_LOCATIONS_POINTMAP: {
      return []
    }
    case SET_ORIGIN_LOCATIONS_POINTMAP: {
      if (state == null) state = []
      return state.concat(action.payload)
    }
      break;
    case REMOVE_AN_ORIGIN_FOR_POINTMAP: {
      let newState = state.filter((origin, i) => state.indexOf(action.payload) != i)
      return newState
    }
      break;
    default:
      return state
  }
}

export default selectedOriginsPointmap
