import {
  SET_ORIGIN_LISTVIEW,
  REMOVE_ORIGIN_LISTVIEW
} from '../../constants/listview'

const selectedOriginListView = (state = null, action) => {
  switch (action.type) {
    case SET_ORIGIN_LISTVIEW:
      return action.payload
      break;
    case REMOVE_ORIGIN_LISTVIEW:
      return null
      break;
    default:
      return state
  }
}

export default selectedOriginListView
