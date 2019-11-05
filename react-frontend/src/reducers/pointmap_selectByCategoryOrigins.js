import {
  SHOW_SELECT_BY_CATEGORY_ORIGINS_POINTMAP,
  HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP
} from '../constants/constants'

const pointmap_selectByCategoryOrigins = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECT_BY_CATEGORY_ORIGINS_POINTMAP:
      return true
      break;
    case HIDE_SELECT_BY_CATEGORY_ORIGINS_POINTMAP:
      return false
      break;
    default:
      return state
  }
}

export default pointmap_selectByCategoryOrigins
