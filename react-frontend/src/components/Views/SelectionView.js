import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import OriginSpidermapElement from '../LocationElements/OriginSpidermapElement'
import OriginListViewElement from '../LocationElements/OriginListViewElement'
import SelectableOriginPointmapElement from '../LocationElements/SelectableOriginPointmapElement'
import DestinationSpidermapElement from '../LocationElements/DestinationSpidermapElement'
import DestinationPointmapElement from '../LocationElements/DestinationPointmapElement'
import DestinationListViewElement from '../LocationElements/DestinationListViewElement'
import AddEditOriginsButton_Pointmap from '../Buttons/AddEditOriginsButton_Pointmap'
import AddEditDestinationsButton_Pointmap from '../Buttons/AddEditDestinationsButton_Pointmap'
import AddEditDestinationsButton_Spidermap from '../Buttons/AddEditDestinationsButton_Spidermap'
import AddEditDestinationsButton_ListView from '../Buttons/AddEditDestinationsButton_ListView'
import _ from 'lodash'

const SelectionView = ({ ...props }) => {

  const dispatch = useDispatch()

  const selectedOriginListView = useSelector(state => state.selectedOriginListView)

  const selectedOriginSpidermap = useSelector(state => state.selectedOriginSpidermap)

  const selectedOriginsPointmap = useSelector(state => state.selectedOriginsPointmap)

  const selectedDestinationsSpidermap = useSelector(state => state.selectedDestinationsSpidermap)

  const selectedDestinationsPointmap = useSelector(state => state.selectedDestinationsPointmap)

  const selectedDestinationsListView = useSelector(state => state.selectedDestinationsListView)

  const currentlySelectedOriginPointmap = useSelector(state => state.currentlySelectedOriginPointmap)

  const selectBy_DestinationsVisibility = useSelector(state => state.selectBy_DestinationsVisibility)

  const label = () => {
    switch (props.type) {
      case 'spidermap-origin':
      case 'listview-origin':
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
      <div style={{overflow:'scroll',backgroundColor:'cyan',height:'100vh',margin:'-48px 0 0 20px'}}>
        <div>{label()}</div>
        <div style={{overflow:'scroll'}}>
          {
            (props.type == 'listview-origin' && selectedOriginListView)
            ? (<Fragment key={selectedOriginListView.id}>
                <OriginListViewElement originObject={selectedOriginListView} code={selectedOriginListView.code}/>
               </Fragment>)
            : null
          }
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
            /* conditionally show the Add/Edit Destinations button if selectBy_DestinationsVisibility panel is open, then hide the button */
            props.type.search('-destinations') > -1
            ? selectBy_DestinationsVisibility
              ? null
              : props.type.search('spidermap-') > -1
                ? <AddEditDestinationsButton_Spidermap/>
                :
                  props.type.search('listview-') > -1
                  ? <AddEditDestinationsButton_ListView/> : <AddEditDestinationsButton_Pointmap/>
            :
              props.type.search('spidermap-') > -1 || props.type.search('listview-') > -1
              ? null
              : <AddEditOriginsButton_Pointmap/>
          }
        </div>
      </div>
    </>
  )

}

export default SelectionView
