import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP } from '../../constants/constants'
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
          {selectedOriginsPointmap ? <div style={{fontSize:'.85rem'}}>Tap on each Origin to set Destinations</div> : null}
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
      </div>
    </>
  )

}

export default SelectionView
