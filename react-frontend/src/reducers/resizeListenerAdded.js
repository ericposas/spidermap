import { RESIZE_ADDED } from '../constants/constants'

const resizeListenerAdded = (state, action) => {

  switch (action.type) {
    case RESIZE_ADDED:
      return true
      break;
    default:
      return false
  }

}

export default resizeListenerAdded
