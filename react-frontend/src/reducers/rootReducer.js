import { combineReducers } from 'redux'

import lastLocation from './lastLocation'
import selectedOriginSpidermap from './selectedOriginSpidermap'
import selectedOriginsPointmap from './selectedOriginsPointmap'
import selectedDestinationsPointmap from './selectedDestinationsPointmap'
import selectedDestinationsSpidermap from './selectedDestinationsSpidermap'
import selectedDestinationsListView from './selectedDestinationsListView'
import currentlySelectedOriginPointmap from './currentlySelectedOriginPointmap'
import selectByCategoryOrCodePanelVisibility from './selectByCategoryOrCodePanelVisibility'
import destinationPanelVisibility from './destinationPanelVisibility'
import selectByCategory from './selectByCategory'
import selectByCode from './selectByCode'

const rootReducer = combineReducers({
  lastLocation, selectedOriginSpidermap, selectedOriginsPointmap,
  selectedDestinationsPointmap, selectedDestinationsSpidermap,
  selectedDestinationsListView, currentlySelectedOriginPointmap,
  selectByCode, selectByCategory, selectByCategoryOrCodePanelVisibility,
  destinationPanelVisibility
})

export default rootReducer
