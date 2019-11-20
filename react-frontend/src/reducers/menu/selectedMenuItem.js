import {
  CREATE_A_MAP,
  EDIT_VIEW_MY_MAPS,
  GLOBAL_MAPS,
  SPIDERMAP,
  POINTMAP,
  LISTVIEW,
  CLEAR_SELECTED_MENU_ITEM,
} from '../../constants/menu'

const selectedMenuItem = (state = null, action) => {
  switch (action.type) {
    case CLEAR_SELECTED_MENU_ITEM:
      return null;
      break;
    case SPIDERMAP:
    case POINTMAP:
    case LISTVIEW:
    case CREATE_A_MAP:
    case EDIT_VIEW_MY_MAPS:
    case GLOBAL_MAPS:
      return action.type
      break;
    default:
      return state;
  }
}

export default selectedMenuItem
