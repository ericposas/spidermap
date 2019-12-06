import {
  SAVING_FILE,
  FILE_SAVED,
  HIDE_FILE_SAVE_NOTIFICATION,
} from '../constants/constants'

const savingFile = (state = null, action) => {

  switch (action.type) {
    case HIDE_FILE_SAVE_NOTIFICATION:
      return null
    case SAVING_FILE:
      return SAVING_FILE
      break
    case FILE_SAVED:
      return FILE_SAVED
      break
    default:
      return state
  }

}

export default savingFile
