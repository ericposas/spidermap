import { DOWNLOADED_PDF, DOWNLOADING_PDF } from '../constants/constants'

const downloadPDFStatus = (state = false, action) => {
  switch (action.type) {
    case DOWNLOADED_PDF:
      return false;
      break;
    case DOWNLOADING_PDF:
      return true;
      break;
    default:
      return state
  }
}

export default downloadPDFStatus
