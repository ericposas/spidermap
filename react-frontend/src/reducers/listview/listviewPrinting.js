import { PRINTING_LISTVIEW, NOT_PRINTING_LISTVIEW } from '../../constants/listview'

const listviewPrintingState = (state = false, action) => {
  switch (action.type) {
    case PRINTING_LISTVIEW:
      return true;
      break;
    case NOT_PRINTING_LISTVIEW:
      return false;
      break;
    default:
      return false;
  }
}

export default listviewPrintingState
