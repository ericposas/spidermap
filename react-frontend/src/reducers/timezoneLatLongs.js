import { SET_TIMEZONE_LATLONGS } from '../constants/constants'

const timezoneLatLongs = (state = null, action) => {

  switch (action.type) {
    case SET_TIMEZONE_LATLONGS:
      return action.payload
      break;
    default:
      return state
  }

}

export default timezoneLatLongs
