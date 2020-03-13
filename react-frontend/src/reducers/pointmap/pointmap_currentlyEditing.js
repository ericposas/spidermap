import {
  SET_POINTMAP_CURRENTLY_EDITING
} from '../../constants/pointmap'

const pointmap_currentlyEditing = (state = null, action) => {
  switch (action.type) {
    case SET_POINTMAP_CURRENTLY_EDITING:
      return action.payload
      break;
    default:
      return state
  }
}

export default pointmap_currentlyEditing
