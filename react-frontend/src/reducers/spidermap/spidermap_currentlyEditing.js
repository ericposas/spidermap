import {
  SET_SPIDERMAP_CURRENTLY_EDITING
} from '../../constants/spidermap'

const spidermap_currentlyEditing = (state = null, action) => {
  switch (action.type) {
    case SET_SPIDERMAP_CURRENTLY_EDITING:
      return action.payload
      break;
    default:
      return state
  }
}

export default spidermap_currentlyEditing
