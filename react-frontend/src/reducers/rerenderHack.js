import {
  RERENDER_HACK
} from '../constants/constants'

const rerenderHack = (state = false, action) => {

  switch (action.type) {
    case RERENDER_HACK:
      return action.payload
      break;
    default:
      return state
  }

}

export default rerenderHack
