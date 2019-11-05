import {
  SET_DESTINATION_LOCATIONS_LISTVIEW,
  REMOVE_A_DESTINATION_LISTVIEW
} from '../../constants/listview'

const selectedDestinationsListView = (state = [], action) => {
  switch (action.type) {
    case SET_DESTINATION_LOCATIONS_LISTVIEW: {
      return state.concat(action.payload)
    }
      break;
    case REMOVE_A_DESTINATION_LISTVIEW: {
      let newState = state.slice(0)
      let first = newState.slice(0, newState.indexOf(action.payload))
      let second = newState.slice(newState.indexOf(action.payload)+1, newState.length)
      newState = first.concat(second)
      return newState
    }
      break;
    default:
      return state
  }
}

export default selectedDestinationsListView
