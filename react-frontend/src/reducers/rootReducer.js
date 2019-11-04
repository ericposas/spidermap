import { combineReducers } from 'redux'

import lastLocation from './lastLocation'
import selectedOriginSpidermap from './selectedOriginSpidermap'
import selectedOriginsPointmap from './selectedOriginsPointmap'
import selectedDestinationsPointmap from './selectedDestinationsPointmap'
import selectedDestinationsSpidermap from './selectedDestinationsSpidermap'
import selectedDestinationsListView from './selectedDestinationsListView'
import currentlySelectedOriginPointmap from './currentlySelectedOriginPointmap'
import selectBy_OriginsVisibility from './selectBy_OriginsVisibility'
import selectBy_DestinationsVisibility from './selectBy_DestinationsVisibility'
import selectByCategoryOrigins from './selectByCategoryOrigins'
import selectByCodeOrigins from './selectByCodeOrigins'
import selectByCategoryDestinations from './selectByCategoryDestinations'
import selectByCodeDestinations from './selectByCodeDestinations'
import destinationPanelVisibility from './destinationPanelVisibility'

const rootReducer = combineReducers({
  lastLocation, selectedOriginSpidermap, selectedOriginsPointmap,
  selectedDestinationsPointmap, selectedDestinationsSpidermap,
  selectedDestinationsListView, currentlySelectedOriginPointmap,
  selectByCodeOrigins, selectByCategoryOrigins,
  selectByCodeDestinations, selectByCategoryDestinations,
  selectBy_DestinationsVisibility, selectBy_OriginsVisibility,
  destinationPanelVisibility
})

export default rootReducer
