import { LISTVIEW_RENDERING, LISTVIEW_NOT_RENDERING } from '../../constants/listview'

const listviewRendering = (state = false, action) => {
  switch (action.type) {
    case LISTVIEW_RENDERING:
      return true;
      break;
    case LISTVIEW_NOT_RENDERING:
      return false;
      break;
    default:
      return state
  }
}

export default listviewRendering
