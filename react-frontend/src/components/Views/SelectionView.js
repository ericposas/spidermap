import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import {
  SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP,
  SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL,
  HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL,
  HIDE_SELECT_BY_CODE,
  HIDE_SELECT_BY_CATEGORY,
  HIDE_DESTINATION_PANEL
} from '../../constants/constants'
import OriginSpidermapElement from '../LocationElements/OriginSpidermapElement'
import SelectableOriginPointmapElement from '../LocationElements/SelectableOriginPointmapElement'
import DestinationSpidermapElement from '../LocationElements/DestinationSpidermapElement'
import DestinationPointmapElement from '../LocationElements/DestinationPointmapElement'
import DestinationListViewElement from '../LocationElements/DestinationListViewElement'
import _ from 'lodash'

const SelectionView = ({ ...props }) => {

  const dispatch = useDispatch()

  const selectedOriginSpidermap = useSelector(state => state.selectedOriginSpidermap)

  const selectedOriginsPointmap = useSelector(state => state.selectedOriginsPointmap)

  const selectedDestinationsSpidermap = useSelector(state => state.selectedDestinationsSpidermap)

  const selectedDestinationsPointmap = useSelector(state => state.selectedDestinationsPointmap)

  const selectedDestinationsListView = useSelector(state => state.selectedDestinationsListView)

  const currentlySelectedOriginPointmap = useSelector(state => state.currentlySelectedOriginPointmap)

  const label = () => {
    switch (props.type) {
      case 'spidermap-origin':
        return (<><div>Origin</div></>)
        break;
      case 'pointmap-origins':
        return (<>
          <div>Origins</div>
          { selectedOriginsPointmap ? <div style={{display:'inline-block',fontSize:'.85rem'}}>Tap on each Origin to set Destinations</div> : null }
        </>)
        break;
      case 'pointmap-destinations':
        return (<><div>Destinations for {currentlySelectedOriginPointmap}</div></>)
        break;
      case 'spidermap-destinations':
      case 'listview-destinations':
        return (<><div>Destinations</div></>)
        break;
      default:
        return (<><div>Selection View</div></>)
    }
  }

  return (
    <>
      <br/>
      <br/>
      <div style={{backgroundColor:'cyan',height:'100vh',margin:'-48px 0 0 20px'}}>
        <div>{label()}</div>
        <div>
          {
            (props.type == 'spidermap-origin' && selectedOriginSpidermap)
            ? (<Fragment key={selectedOriginSpidermap.id}>
                <OriginSpidermapElement originObject={selectedOriginSpidermap} code={selectedOriginSpidermap.code}/>
               </Fragment>)
            : null
          }
          {
            (props.type == 'pointmap-origins' && selectedOriginsPointmap)
            ? selectedOriginsPointmap.map(location => (
              <Fragment key={location.id}>
                <SelectableOriginPointmapElement originObject={location} code={location.code}/>
              </Fragment>))
            : null
          }
          {
            (props.type == 'spidermap-destinations' && selectedDestinationsSpidermap)
            ? selectedDestinationsSpidermap.map(location => (
              <Fragment key={location.id}>
                <DestinationSpidermapElement destinationObject={location} code={location.code}/>
              </Fragment>))
            : null
          }
          {
            (props.type == 'pointmap-destinations' && selectedDestinationsPointmap && selectedDestinationsPointmap[currentlySelectedOriginPointmap])
            ? selectedDestinationsPointmap[currentlySelectedOriginPointmap].map(location => (
              <Fragment key={location.id}>
                <DestinationPointmapElement destinationObject={location} code={location.code}/>
              </Fragment>))
            : null
          }
          {
            (props.type == 'listview-destinations' && selectedDestinationsListView)
            ? selectedDestinationsListView.map(location => (
              <Fragment key={location.id}>
                <DestinationListViewElement destinationObject={location} code={location.code}/>
              </Fragment>))
            : null
          }
          {
            props.type.search('-destinations') > -1
            ? <button onClick={() => {
                dispatch({ type: SHOW_SELECT_BY_CATEGORY_OR_CODE_PANEL })
              }}>+ Add / Edit Destinations</button>
              : <button onClick={() => {
                batch(() => {
                  dispatch({ type: SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP, payload: null })
                  dispatch({ type: HIDE_SELECT_BY_CATEGORY_OR_CODE_PANEL })
                  dispatch({ type: HIDE_SELECT_BY_CATEGORY })
                  dispatch({ type: HIDE_SELECT_BY_CODE })
                  dispatch({ type: HIDE_DESTINATION_PANEL })
                })
              }}>+ Add / Edit Origins</button>
            }
        </div>
      </div>
    </>
  )

}

export default SelectionView
