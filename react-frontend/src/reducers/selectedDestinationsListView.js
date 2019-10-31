import { SET_DESTINATION_LOCATIONS_LISTVIEW } from '../constants/constants'

const selectedDestinationsListView = (state = [], action) => {
  switch (action.type) {
    case SET_DESTINATION_LOCATIONS_LISTVIEW:
      return state.concat(action.payload)
      break;
    default:
      return state
  }
}

export default selectedDestinationsListView
