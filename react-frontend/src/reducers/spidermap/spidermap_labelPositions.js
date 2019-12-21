import {
  SET_LABEL_POSITION_SPIDERMAP,
  SET_ALL_LABEL_POSITIONS_SPIDERMAP,
} from '../../constants/spidermap'

const spidermap_labelPositions = (state = null, action) => {

  switch (action.type) {
    case SET_LABEL_POSITION_SPIDERMAP:
      return {
        ...state,
        [action.which]: {
          position: action.position
        }
      }
      break;
    case SET_ALL_LABEL_POSITIONS_SPIDERMAP:
      return action.payload
    default:
      return state
  }

}

export default spidermap_labelPositions
