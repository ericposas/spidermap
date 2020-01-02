import {
  SET_LABEL_POSITION_POINTMAP,
  SET_ALL_LABEL_POSITIONS_POINTMAP,
} from '../../constants/pointmap'

const pointmap_labelPositions = (state = null, action) => {

  switch (action.type) {
    case SET_LABEL_POSITION_POINTMAP:
      return {
        ...state,
        [action.which]: {
          position: action.position
        }
      }
      break;
    case SET_ALL_LABEL_POSITIONS_POINTMAP:
      return action.payload
    default:
      return state
  }

}

export default pointmap_labelPositions
