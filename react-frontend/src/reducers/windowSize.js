import { WINDOW_RESIZE } from '../constants/constants'

const windowSize = (state = {}, action) => {

  switch (action.type) {
    case WINDOW_RESIZE:
      return action.payload
      break;
    default:
      return state
  }

}

export default windowSize
