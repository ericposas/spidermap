import {
  SET_LISTVIEW_CURRENTLY_EDITING
} from '../../constants/listview'

const listview_currentlyEditing = (state = null, action) => {
  switch (action.type) {
    case SET_LISTVIEW_CURRENTLY_EDITING:
      return action.payload
      break;
    default:
      return state
  }
}

export default listview_currentlyEditing
