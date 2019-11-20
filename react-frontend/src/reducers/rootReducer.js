import { combineReducers } from 'redux'

import lastLocation from './lastLocation'
import selectedOriginListView from './listview/selectedOriginListView'
import selectedDestinationsListView from './listview/selectedDestinationsListView'
import listview_selectBy_DestinationsVisibility from './listview/listview_selectBy_DestinationsVisibility'
import listview_selectByCategoryDestinations from './listview/listview_selectByCategoryDestinations'
import listview_selectByCodeDestinations from './listview/listview_selectByCodeDestinations'
import listview_destinationPanelVisibility from './listview/listview_destinationPanelVisibility'
import selectedOriginSpidermap from './spidermap/selectedOriginSpidermap'
import selectedDestinationsSpidermap from './spidermap/selectedDestinationsSpidermap'
import spidermap_selectBy_DestinationsVisibility from './spidermap/spidermap_selectBy_DestinationsVisibility'
import spidermap_selectByCategoryDestinations from './spidermap/spidermap_selectByCategoryDestinations'
import spidermap_selectByCodeDestinations from './spidermap/spidermap_selectByCodeDestinations'
import spidermap_destinationPanelVisibility from './spidermap/spidermap_destinationPanelVisibility'
import selectedOriginsPointmap from './pointmap/selectedOriginsPointmap'
import selectedDestinationsPointmap from './pointmap/selectedDestinationsPointmap'
import currentlySelectedOriginPointmap from './pointmap/currentlySelectedOriginPointmap'
import pointmap_selectBy_OriginsVisibility from './pointmap/pointmap_selectBy_OriginsVisibility'
import pointmap_selectBy_DestinationsVisibility from './pointmap/pointmap_selectBy_DestinationsVisibility'
import pointmap_selectByCategoryOrigins from './pointmap/pointmap_selectByCategoryOrigins'
import pointmap_selectByCodeOrigins from './pointmap/pointmap_selectByCodeOrigins'
import pointmap_selectByCategoryDestinations from './pointmap/pointmap_selectByCategoryDestinations'
import pointmap_selectByCodeDestinations from './pointmap/pointmap_selectByCodeDestinations'
import pointmap_destinationPanelVisibility from './pointmap/pointmap_destinationPanelVisibility'
import allCodesData from './allCodesData'
import selectedMenuItem from './menu/selectedMenuItem'

const rootReducer = combineReducers({
  lastLocation,
  allCodesData,
  selectedOriginListView,
  selectedDestinationsListView,
  listview_selectBy_DestinationsVisibility, listview_selectByCategoryDestinations,
  listview_selectByCodeDestinations, listview_destinationPanelVisibility,
  currentlySelectedOriginPointmap,
  selectedOriginsPointmap, selectedDestinationsPointmap,
  pointmap_selectByCodeOrigins, pointmap_selectByCategoryOrigins,
  pointmap_selectByCodeDestinations, pointmap_selectByCategoryDestinations,
  pointmap_selectBy_DestinationsVisibility, pointmap_selectBy_OriginsVisibility,
  pointmap_destinationPanelVisibility,
  selectedOriginSpidermap,
  selectedDestinationsSpidermap, spidermap_selectByCodeDestinations,
  spidermap_selectByCategoryDestinations, spidermap_selectBy_DestinationsVisibility,
  spidermap_destinationPanelVisibility,
  selectedMenuItem
})

export default rootReducer
