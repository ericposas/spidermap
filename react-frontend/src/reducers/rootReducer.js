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
import listviewRendering from './listview/listviewRendering'
import listviewPrinting from './listview/listviewPrinting'
import downloadPDFStatus from './downloadPDF'
import exportFileType from './exportFileType'
import myMaps from './myMaps'
import globalMaps from './globalMaps'
import uploadingCSVNotification from './uploadingCSVNotification'
import uploadCSVDoneNotification from './uploadCSVDoneNotification'
import savingFile from './savingFile'
import displayMapBG from './displayMapBG'
import timezoneLatLongs from './timezoneLatLongs'
import windowSize from './windowSize'
import resizeListenerAdded from './resizeListenerAdded'
import spidermap_labelDisplayTypes from './spidermap/spidermap_labelDisplayTypes'
import spidermap_labelPositions from './spidermap/spidermap_labelPositions'
import pointmap_labelDisplayTypes from './pointmap/pointmap_labelDisplayTypes'
import pointmap_labelPositions from './pointmap/pointmap_labelPositions'


const rootReducer = combineReducers({
  windowSize,
  resizeListenerAdded,
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
  pointmap_labelPositions, pointmap_labelDisplayTypes,
  selectedOriginSpidermap,
  selectedDestinationsSpidermap, spidermap_selectByCodeDestinations,
  spidermap_selectByCategoryDestinations, spidermap_selectBy_DestinationsVisibility,
  spidermap_destinationPanelVisibility,
  spidermap_labelPositions, spidermap_labelDisplayTypes,
  selectedMenuItem,
  listviewRendering, listviewPrinting,
  downloadPDFStatus,
  exportFileType,
  myMaps, globalMaps,
  uploadingCSVNotification, uploadCSVDoneNotification,
  savingFile,
  displayMapBG,
  timezoneLatLongs
})

export default rootReducer
