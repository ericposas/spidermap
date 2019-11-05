import {
  SET_DESTINATION_LOCATIONS_LISTVIEW,
  REMOVE_A_DESTINATION_LISTVIEW,
  REMOVE_ALL_DESTINATIONS_LISTVIEW
} from '../../constants/listview'

const selectedDestinationsListView = (state = [], action) => {
  switch (action.type) {
    case SET_DESTINATION_LOCATIONS_LISTVIEW: {
      let { origin, item } = action.payload
      if (origin.code != item.code) return state.concat(item)
      else return state
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
    case REMOVE_ALL_DESTINATIONS_LISTVIEW: {
      return []
    }
    default:
      return state
  }
}

export default selectedDestinationsListView
