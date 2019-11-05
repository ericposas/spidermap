import {
  SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP
} from '../../constants/pointmap'

const currentlySelectedOriginPointmap = (state = '', action) => {
  switch (action.type) {
    case SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP:
      return action.payload
      break;
    default:
      return state
  }
}

export default currentlySelectedOriginPointmap
