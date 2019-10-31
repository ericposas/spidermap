import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'

const SelectionView = ({ ...props }) => {

  const selectedOriginSpidermap = useSelector(state => state.selectedOriginSpidermap)

  const selectedOriginsPointmap = useSelector(state => state.selectedOriginsPointmap)

  const selectedDestinationsSpidermap = useSelector(state => state.selectedDestinationsSpidermap)

  const selectedDestinationsPointmap = useSelector(state => state.selectedDestinationsPointmap)

  const selectedDestinationsListView = useSelector(state => state.selectedDestinationsListView)

  const label = () => {
    switch (props.type) {
      case 'spidermap-origin':
        return (<><div>Origin</div></>)
        break;
      case 'pointmap-origins':
        return (<><div>Origins</div></>)
        break;
      case 'spidermap-destinations':
      case 'pointmap-destinations':
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
          ? (<Fragment key={selectedOriginSpidermap.id}><div>{selectedOriginSpidermap.code}</div></Fragment>)
          : null
        }
        {
          (props.type == 'pointmap-origins' && selectedOriginsPointmap)
          ? selectedOriginsPointmap.map(location => (<Fragment key={location.id}><div>{location.code}</div></Fragment>))
          : null
        }
        {
          (props.type == 'spidermap-destinations' && selectedDestinationsSpidermap)
          ? selectedDestinationsSpidermap.map(location => (<Fragment key={location.id}><div>{location.code}</div></Fragment>))
          : null
        }
        {
          (props.type == 'pointmap-destinations' && selectedDestinationsPointmap)
          ? selectedDestinationsPointmap.map(location => (<Fragment key={location.id}><div>{location.code}</div></Fragment>))
          : null
        }
        {
          (props.type == 'listview-destinations' && selectedDestinationsListView)
          ? selectedDestinationsListView.map(location => (<Fragment key={location.id}><div>{location.code}</div></Fragment>))
          : null
        }
      </div>
    </>
  )

}

export default SelectionView
