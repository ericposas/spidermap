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

  const [_filter, setFilter] = useState('')

  const label = () => {
    switch (props.type) {
      case 'spidermap-origin':
      case 'listview-origin':
        return (<><div className='subtitle'>Origin</div></>)
        break;
      case 'pointmap-origins':
        return (<>
          <div className='subtitle'>Origins</div>
          {
            selectedOriginsPointmap
            ?
              <>
                <div style={{display:'inline-block',fontSize:'.85rem'}}>
                  Tap on each Origin to set Destinations
                </div><br/>
              </>
            : null
          }
        </>)
        break;
      case 'pointmap-destinations':
        return (<><div className='subtitle'>Destinations for {currentlySelectedOriginPointmap}</div></>)
        break;
      case 'spidermap-destinations':
        return (<><div className='subtitle'>Destination Airports from {selectedOriginSpidermap.code}</div></>)
        break;
      case 'listview-destinations':
        return (<><div className='subtitle'>Destination Airports from {selectedOriginListView.code}</div></>)
        break;
      default:
        return (<><div className='subtitle'>Selection View</div></>)
    }
  }

  return (
    <>
      <br/>
      <br/>
      <div
        className='scrollable panel-style'
        style={{
          overflow:'scroll',
          height:'100vh',
          margin:'-48px 0 0 0',
          padding:'15% 20px 0 20px',
        }}>
        <div style={{  marginTop: '-20px' }}>Filter:</div>
        <input
          style={{
            border: '1px solid #ccc', width: '100%',
            borderRadius: '2px'
          }}
          value={_filter}
          onChange={e => setFilter(e.target.value)}/><br/><br/>
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
            ? selectedOriginsPointmap.filter(item => {
                if (item.code.indexOf(_filter) > -1 || item.fullname.indexOf(_filter) > -1 ||
                    item.region.indexOf(_filter) > -1 || item.city.indexOf(_filter) > -1 ||
                    item.code.toLowerCase().indexOf(_filter) > -1 || item.fullname.toLowerCase().indexOf(_filter) > -1 ||
                    item.region.toLowerCase().indexOf(_filter) > -1 || item.city.toLowerCase().indexOf(_filter) > -1 ||
                    item.code.toUpperCase().indexOf(_filter) > -1 || item.fullname.toUpperCase().indexOf(_filter) > -1 ||
                    item.region.toUpperCase().indexOf(_filter) > -1 || item.city.toUpperCase().indexOf(_filter) > -1) {
                   return item
                 }
              })
              .map(location => (
                <Fragment key={location.id}>
                  <SelectableOriginPointmapElement clearFilter={() => setFilter('')} originObject={location} code={location.code}/>
                </Fragment>))
            : null
          }
          {
            (props.type == 'spidermap-destinations' && selectedDestinationsSpidermap)
            ? selectedDestinationsSpidermap.filter(item => {
                if (item.code.indexOf(_filter) > -1 || item.fullname.indexOf(_filter) > -1 ||
                    item.region.indexOf(_filter) > -1 || item.city.indexOf(_filter) > -1 ||
                    item.code.toLowerCase().indexOf(_filter) > -1 || item.fullname.toLowerCase().indexOf(_filter) > -1 ||
                    item.region.toLowerCase().indexOf(_filter) > -1 || item.city.toLowerCase().indexOf(_filter) > -1 ||
                    item.code.toUpperCase().indexOf(_filter) > -1 || item.fullname.toUpperCase().indexOf(_filter) > -1 ||
                    item.region.toUpperCase().indexOf(_filter) > -1 || item.city.toUpperCase().indexOf(_filter) > -1) {
                    return item
                  }
                })
                .map(location => (
                  <Fragment key={location.id}>
                    <DestinationSpidermapElement clearFilter={() => setFilter('')} destinationObject={location} code={location.code}/>
                  </Fragment>))
            : null
          }
          {
            (props.type == 'pointmap-destinations' && selectedDestinationsPointmap && selectedDestinationsPointmap[currentlySelectedOriginPointmap])
            ? selectedDestinationsPointmap[currentlySelectedOriginPointmap].filter(item => {
                if (item.code.indexOf(_filter) > -1 || item.fullname.indexOf(_filter) > -1 ||
                    item.region.indexOf(_filter) > -1 || item.city.indexOf(_filter) > -1 ||
                    item.code.toLowerCase().indexOf(_filter) > -1 || item.fullname.toLowerCase().indexOf(_filter) > -1 ||
                    item.region.toLowerCase().indexOf(_filter) > -1 || item.city.toLowerCase().indexOf(_filter) > -1 ||
                    item.code.toUpperCase().indexOf(_filter) > -1 || item.fullname.toUpperCase().indexOf(_filter) > -1 ||
                    item.region.toUpperCase().indexOf(_filter) > -1 || item.city.toUpperCase().indexOf(_filter) > -1) {
                    return item
                  }
                })
                .map(location => (
                  <Fragment key={location.id}>
                    <DestinationPointmapElement clearFilter={() => setFilter('')} destinationObject={location} code={location.code}/>
                  </Fragment>))
            : null
          }
          {
            (props.type == 'listview-destinations' && selectedDestinationsListView)
            ? selectedDestinationsListView.filter(item => {
                if (item.code.indexOf(_filter) > -1 || item.fullname.indexOf(_filter) > -1 ||
                    item.region.indexOf(_filter) > -1 || item.city.indexOf(_filter) > -1 ||
                    item.code.toLowerCase().indexOf(_filter) > -1 || item.fullname.toLowerCase().indexOf(_filter) > -1 ||
                    item.region.toLowerCase().indexOf(_filter) > -1 || item.city.toLowerCase().indexOf(_filter) > -1 ||
                    item.code.toUpperCase().indexOf(_filter) > -1 || item.fullname.toUpperCase().indexOf(_filter) > -1 ||
                    item.region.toUpperCase().indexOf(_filter) > -1 || item.city.toUpperCase().indexOf(_filter) > -1) {
                    return item
                  }
                })
                .map(location => (
                  <Fragment key={location.id}>
                    <DestinationListViewElement clearFilter={() => setFilter('')} destinationObject={location} code={location.code}/>
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
