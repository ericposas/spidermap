import {
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL
} from '../constants/constants'

const selectByCategoryOrCodeVisibility = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL:
      return true
      break;
    case HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL:
      return false
      break;
    default:
      return state
  }
}

export default selectByCategoryOrCodeVisibility
