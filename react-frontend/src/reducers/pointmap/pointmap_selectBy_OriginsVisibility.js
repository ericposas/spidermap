import {
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_POINTMAP
} from '../../constants/pointmap'

const pointmap_selectBy_OriginsVisibility = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_POINTMAP:
      return true
      break;
    case HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL_ORIGINS_POINTMAP:
      return false
      break;
    default:
      return state
  }
}

export default pointmap_selectBy_OriginsVisibility
