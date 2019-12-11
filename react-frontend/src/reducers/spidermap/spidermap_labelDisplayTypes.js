import {
  SET_LABEL_DISPLAY_TYPE_SPIDERMAP
} from '../../constants/spidermap'

const spidermap_labelDisplayTypes = (state = {}, action) => {

  switch (action.type) {
    case SET_LABEL_DISPLAY_TYPE_SPIDERMAP:
      return {
        ...state,
        [action.which]: {
          displayType: action.displayType
        }
      }
      break;
    default:
      return state
  }

}

export default spidermap_labelDisplayTypes
