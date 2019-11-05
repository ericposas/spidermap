import { combineReducers } from 'redux'

import lastLocation from './lastLocation'
import selectedOriginSpidermap from './selectedOriginSpidermap'
import selectedOriginsPointmap from './selectedOriginsPointmap'
import selectedDestinationsPointmap from './selectedDestinationsPointmap'
import selectedDestinationsSpidermap from './selectedDestinationsSpidermap'
import selectedDestinationsListView from './selectedDestinationsListView'
import currentlySelectedOriginPointmap from './currentlySelectedOriginPointmap'
import pointmap_selectBy_OriginsVisibility from './pointmap_selectBy_OriginsVisibility'
import pointmap_selectBy_DestinationsVisibility from './pointmap_selectBy_DestinationsVisibility'
import pointmap_selectByCategoryOrigins from './pointmap_selectByCategoryOrigins'
import pointmap_selectByCodeOrigins from './pointmap_selectByCodeOrigins'
import pointmap_selectByCategoryDestinations from './pointmap_selectByCategoryDestinations'
import pointmap_selectByCodeDestinations from './pointmap_selectByCodeDestinations'
import pointmap_destinationPanelVisibility from './pointmap_destinationPanelVisibility'
import spidermap_selectBy_DestinationsVisibility from './spidermap_selectBy_DestinationsVisibility'
import spidermap_selectByCategoryDestinations from './spidermap_selectByCategoryDestinations'
import spidermap_selectByCodeDestinations from './spidermap_selectByCodeDestinations'
import spidermap_destinationPanelVisibility from './spidermap_destinationPanelVisibility'

const rootReducer = combineReducers({
  lastLocation, selectedOriginSpidermap, selectedOriginsPointmap,
  selectedDestinationsPointmap, selectedDestinationsSpidermap,
  selectedDestinationsListView, currentlySelectedOriginPointmap,
  pointmap_selectByCodeOrigins, pointmap_selectByCategoryOrigins,
  pointmap_selectByCodeDestinations, pointmap_selectByCategoryDestinations,
  pointmap_selectBy_DestinationsVisibility, pointmap_selectBy_OriginsVisibility,
  pointmap_destinationPanelVisibility,
  spidermap_selectByCodeDestinations, spidermap_selectByCategoryDestinations,
  spidermap_selectBy_DestinationsVisibility,
  spidermap_destinationPanelVisibility,
})

export default rootReducer
