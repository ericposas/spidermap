import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP } from '../../constants/constants'
import SelectableOriginPointmap from './SelectableOriginPointmap'
import _ from 'lodash'

const SelectionView = ({ ...props }) => {

  const dispatch = useDispatch()

  const selectedOriginSpidermap = useSelector(state => state.selectedOriginSpidermap)

  const selectedOriginsPointmap = useSelector(state => state.selectedOriginsPointmap)

  const selectedDestinationsSpidermap = useSelector(state => state.selectedDestinationsSpidermap)

  const selectedDestinationsPointmap = useSelector(state => state.selectedDestinationsPointmap)

  const selectedDestinationsListView = useSelector(state => state.selectedDestinationsListView)

  const currentlySelectedOriginPointmap = useSelector(state => state.currentlySelectedOriginPointmap)

  // const [selectedOriginStyle, setSelectedOriginStyle] = useState({ color: 'black', fontFamily: 'arial' })

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

  // const setCurrentSelectedOriginPointmap = location => {
  //   setSelectedOriginStyle({ color: 'white', backgroundColor: 'lightblue', border: '2px solid darkblue' })
  //   dispatch({ type: SET_CURRENT_SELECTED_ORIGIN_FOR_POINTMAP, payload: location.code })
  // }

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
          ? selectedOriginsPointmap.map(location => (
            <Fragment key={location.id}>
              <SelectableOriginPointmap originObject={location} code={location.code}/>
            </Fragment>))
          : null
        }
        {
          (props.type == 'spidermap-destinations' && selectedDestinationsSpidermap)
          ? selectedDestinationsSpidermap.map(location => (<Fragment key={location.id}><div>{location.code}</div></Fragment>))
          : null
        }
        {
          (props.type == 'pointmap-destinations' && selectedDestinationsPointmap && selectedDestinationsPointmap[currentlySelectedOriginPointmap])
          ? selectedDestinationsPointmap[currentlySelectedOriginPointmap].map(location => (<Fragment key={location.id}><div>{location.code}</div></Fragment>))
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
