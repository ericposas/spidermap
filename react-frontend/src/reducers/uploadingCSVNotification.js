import { SHOW_UPLOADING_CSV_NOTIFICATION } from '../constants/constants'

const uploadingCSVNotification = (state = false, action) => {
  switch (action.type) {
    case SHOW_UPLOADING_CSV_NOTIFICATION:
      return action.payload
      break
    default:
      return state
  }
}

export default uploadingCSVNotification
