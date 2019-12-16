import { EXPORT_RESOLUTION } from '../constants/constants'

const exportResolution = (state = 1, action) => {

  switch (action.type) {
    case EXPORT_RESOLUTION:
      return action.payload
      break;
    default:
      return state
  }

}

export default exportResolution
