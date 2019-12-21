import {
  SET_LABEL_DISPLAY_TYPE_SPIDERMAP,
  SET_ALL_LABEL_DISPLAY_TYPES_SPIDERMAP,
} from '../../constants/spidermap'

const spidermap_labelDisplayTypes = (state = null, action) => {

  switch (action.type) {
    case SET_LABEL_DISPLAY_TYPE_SPIDERMAP:
      return {
        ...state,
        [action.which]: {
          displayType: action.displayType
        }
      }
      break;
    case SET_ALL_LABEL_DISPLAY_TYPES_SPIDERMAP:
      return action.payload
    default:
      return state
  }

}

export default spidermap_labelDisplayTypes
