import {
  SET_LABEL_DISPLAY_TYPE_POINTMAP,
  SET_ALL_LABEL_DISPLAY_TYPES_POINTMAP,
} from '../../constants/pointmap'

const pointmap_labelDisplayTypes = (state = {}, action) => {

  switch (action.type) {
    case SET_LABEL_DISPLAY_TYPE_POINTMAP:
      return {
        ...state,
        [action.which]: {
          displayType: action.displayType
        }
      }
      break;
    case SET_ALL_LABEL_DISPLAY_TYPES_POINTMAP:
      return action.payload
    default:
      return state
  }

}

export default pointmap_labelDisplayTypes
