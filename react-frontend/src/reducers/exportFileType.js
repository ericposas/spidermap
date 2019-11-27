import { SELECTED_FILE_TYPE } from '../constants/constants'

const exportFileType = (state = '', action) => {
  switch (action.type) {
    case SELECTED_FILE_TYPE:
      return action.payload;
      break;
    default:
      return state
  }
}

export default exportFileType
