import { SET_MAP_NAME } from '../constants/constants'

const editingMapName = (state = '', action) => {

  switch (action.type) {
    case SET_MAP_NAME:
      return action.payload
      break;
    default:
      return state
  }

}

export default editingMapName
