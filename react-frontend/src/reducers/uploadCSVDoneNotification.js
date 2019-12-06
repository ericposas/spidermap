import { SHOW_UPLOADED_CSV_DONE_NOTIFICATION } from '../constants/constants'

const uploadedCSVDoneNotification = (state = false, action) => {
  switch (action.type) {
    case SHOW_UPLOADED_CSV_DONE_NOTIFICATION:
      return action.payload
      break
    default:
      return state
  }
}

export default uploadedCSVDoneNotification
