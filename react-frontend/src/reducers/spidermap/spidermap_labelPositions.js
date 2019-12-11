import {
  SET_LABEL_POSITION_SPIDERMAP
} from '../../constants/spidermap'

const spidermap_labelPositions = (state = {}, action) => {

  switch (action.type) {
    case SET_LABEL_POSITION_SPIDERMAP:
      return {
        ...state,
        [action.which]: {
          position: action.position
        }
      }
      break;
    default:
      return state
  }

}

export default spidermap_labelPositions
