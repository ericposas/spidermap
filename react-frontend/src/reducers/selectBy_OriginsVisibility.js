import {
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS
} from '../constants/constants'

const selectBy_OriginsVisibility = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS:
      return true
      break;
    case HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS:
      return false
      break;
    default:
      return state
  }
}

export default selectBy_OriginsVisibility
