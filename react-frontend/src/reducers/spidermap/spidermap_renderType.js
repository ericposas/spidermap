import {
  SET_SPIDERMAP_RENDERTYPE
} from '../../constants/spidermap'

const spidermap_renderType = (state = 'single-ring', action) => {
  switch (action.type) {
    case SET_SPIDERMAP_RENDERTYPE:
      return action.payload
      break;
    default:
      return state
  }
}

export default spidermap_renderType
