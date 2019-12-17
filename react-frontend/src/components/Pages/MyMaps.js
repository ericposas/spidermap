import React, { useEffect, useState, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { useSelector, useDispatch, batch } from 'react-redux'
import UserLeftSidePanel from '../Views/UserLeftSidePanel'
import { checkAuth, getUser } from '../../sessionStore'
import {
  REMOVE_ORIGIN_LISTVIEW,
  REMOVE_ALL_DESTINATIONS_LISTVIEW,
  SET_ORIGIN_LISTVIEW,
  SET_DESTINATION_LOCATIONS_LISTVIEW,
} from '../../constants/listview'
import {
  REMOVE_ORIGIN_SPIDERMAP,
  REMOVE_ALL_DESTINATIONS_SPIDERMAP,
  SET_ORIGIN_SPIDERMAP,
  SET_DESTINATION_LOCATIONS_SPIDERMAP,
  SET_ALL_LABEL_POSITIONS_SPIDERMAP,
  SET_ALL_LABEL_DISPLAY_TYPES_SPIDERMAP,
} from '../../constants/spidermap'
import {
  CLEAR_ORIGIN_LOCATIONS_POINTMAP,
  SET_DESTINATION_LOCATIONS_POINTMAP_AT_ONCE,
  SET_ORIGIN_LOCATIONS_POINTMAP,
  SET_ALL_LABEL_POSITIONS_POINTMAP,
  SET_ALL_LABEL_DISPLAY_TYPES_POINTMAP,
} from '../../constants/pointmap'
import {
  SET_ALL_CODES,
  LAST_LOCATION,
  SET_MY_MAPS,
} from '../../constants/constants'
import axios from 'axios'
import './my-maps.scss'
import '../Buttons/buttons.scss'
import '../Modals/confirm-delete-modal.scss'

const MyMaps = ({ ...props }) => {

  const dispatch = useDispatch()

  const myMaps = useSelector(state => state.myMaps)

  const allCodesData = useSelector(state => state.allCodesData)

  const [confirmDeleteModal, setConfirmDeleteModal] = useState(null)

  const [mapIdToDelete, setMapIdToDelete] = useState(null)

  const [showDeletingMapFromDB_Notification, setShowDeletingMapFromDB_Notification] = useState(false)

  const [showMapDeleted_Notification, setShowMapDeleted_Notification] = useState(false)

  const options = useSelector(state => state.allCodesData)

  const populateCodes = () => {
    if (!allCodesData) {
      axios.get(`/airports/byCode`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
           .then(data => {
             dispatch({ type: SET_ALL_CODES, payload: data.data })
             getMyMaps()
           })
           .catch(err => console.log(err))
    } else {
      getMyMaps()
    }
  }

  const getMyMaps = (force = false) => {
    axios.get(`/mymaps/${getUser().user._id}`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
         .then(data => {
           dispatch({ type: SET_MY_MAPS, payload: data.data })
         })
         .catch(err => console.log(err))
  }

  const crudDelete = () => {
    setShowDeletingMapFromDB_Notification(true)
    axios.delete(`/mymaps/${mapIdToDelete}`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
         .then(result => {
           setShowDeletingMapFromDB_Notification(false)
           setShowMapDeleted_Notification(true)
           setTimeout(() => setShowMapDeleted_Notification(false), 500)
           setConfirmDeleteModal(false)
           getMyMaps()
         })
         .catch(err => console.log(err))
  }

  const deleteMap = id => {
    // show modal before user confirms deletion
    setConfirmDeleteModal(true)
    setMapIdToDelete(id)
  }

  const createMap = (type, data) => {
    switch (type) {
      case 'pointmap':
        createPointmap(data)
        break;
      case 'spidermap':
        createSpidermap(data)
        break;
      case 'listview':
        createListView(data)
        break;
      default:
        createListView(data)
    }
  }

  const createPointmap = data => {
    // clear our list first, then process new CSV
    batch(() => {
      dispatch({ type: CLEAR_ORIGIN_LOCATIONS_POINTMAP })
      dispatch({ type: SET_DESTINATION_LOCATIONS_POINTMAP_AT_ONCE, payload: {} })
    })
    let dataObj = {}
    let origins = []
    data.forEach((arr, i) => {
      let originCodes = []
      let tmp = [], tmpObjArr = []
      arr.forEach((item, i) => {
        if (item != arr[0]) tmp.push(item)
      })
      tmp.forEach(item => {
        options.forEach(option => {
          if (item.trim() == option.code && item.trim() != arr[0].trim()) {
            tmpObjArr.push(option)
          }
        })
      })
      originCodes.push(arr[0].trim())
      originCodes.forEach(origin => {
        options.forEach(option => {
          if (origin.trim() == option.code) {
            origins.push(option)
          }
        })
      })
      dataObj[arr[0].trim()] = tmpObjArr
    })
    batch(() => {
      dispatch({ type: SET_ORIGIN_LOCATIONS_POINTMAP, payload: origins })
      dispatch({ type: SET_DESTINATION_LOCATIONS_POINTMAP_AT_ONCE, payload: dataObj })
      dispatch({ type: LAST_LOCATION, payload: 'my-maps' })
    })
    props.history.push('/generate-pointmap')
  }

  const createSpidermap = data => {
    // clear list
    batch(() => {
      dispatch({ type: REMOVE_ORIGIN_SPIDERMAP })
      dispatch({ type: REMOVE_ALL_DESTINATIONS_SPIDERMAP })
    })
    let origin
    let destinations = []
    // process save data for spidermap entries
    let _data = data.map(item => item.trim())
    options.forEach(option => {
      _data.forEach(datum => {
        if (option.code == _data[0]) origin = option
        else if (option.code == datum) destinations.push(option)
      })
    })
    batch(() => {
      dispatch({ type: SET_ORIGIN_SPIDERMAP, payload: origin })
      dispatch({ type: SET_DESTINATION_LOCATIONS_SPIDERMAP, payload: { origin: origin, item: destinations.slice(0, destinations.length) } })
      dispatch({ type: LAST_LOCATION, payload: 'my-maps' })
    })
    props.history.push('/generate-spidermap')
  }

  const createListView = data => {
    // clear list
    batch(() => {
      dispatch({ type: REMOVE_ORIGIN_LISTVIEW })
      dispatch({ type: REMOVE_ALL_DESTINATIONS_LISTVIEW })
    })
    let origin
    let destinations = []
    // process save data from database
    let _data = data.map(item => item.trim())
    options.forEach(option => {
      _data.forEach(datum => {
        if (option.code == _data[0]) origin = option
        else if (option.code == datum) destinations.push(option)
      })
    })
    batch(() => {
      dispatch({ type: SET_ORIGIN_LISTVIEW, payload: origin })
      dispatch({ type: SET_DESTINATION_LOCATIONS_LISTVIEW, payload: { origin: origin, item: destinations.slice(0, destinations.length) } })
      dispatch({ type: LAST_LOCATION, payload: 'my-maps' })
    })
    props.history.push('/generate-listview')
  }

  const setLabels = (type, data) => {
    switch (type) {
      case 'spidermap':
        setLabelsAndPositionsSpidermap(data)
        break;
      case 'pointmap':
        setLabelsAndPositionsPointmap(data)
        break;
      default:
        setLabelsAndPositionsSpidermap(data)
    }
  }

  const setLabelsAndPositionsSpidermap = (data) => {
    batch(() => {
      dispatch({ type: SET_ALL_LABEL_POSITIONS_SPIDERMAP, payload: data.positions })
      dispatch({ type: SET_ALL_LABEL_DISPLAY_TYPES_SPIDERMAP, payload: data.displayTypes })
    })
  }

  const setLabelsAndPositionsPointmap = (data) => {
    batch(() => {
      dispatch({ type: SET_ALL_LABEL_POSITIONS_POINTMAP, payload: data.positions })
      dispatch({ type: SET_ALL_LABEL_DISPLAY_TYPES_POINTMAP, payload: data.displayTypes })
    })
  }

  useEffect(() => {
    populateCodes()
  }, [])

  return (<>
    {
      showDeletingMapFromDB_Notification
      ?
        (<div className='deleting-or-saving-to-db-strip'> Deleting map from database... </div>)
      : null
    }
    {
      showMapDeleted_Notification
      ?
        (<div className='deleting-or-saving-to-db-strip'> Map deleted! </div>)
      : null
    }
    {
      confirmDeleteModal
      ?
        (<div className='modal-confirm-delete-backing'>
          <div className='modal-confirm-delete'>
              <div
                className='x-button x-button-maps-confirm-modal'
                onClick={() => setConfirmDeleteModal(false)}>
                <div className='x-button-x-symbol'>x</div>
              </div>
            <div className='modal-confirm-yes-no-button-container'>
              <div>Are you sure that you want to delete this map? <span style={{opacity:0}}>{mapIdToDelete}</span></div>
              <br/>
              <button
              className='button-plain button-decline'
              onClick={() => setConfirmDeleteModal(false)} style={{ display:'inline-block' }}>Nevermind.</button>
              <span style={{ paddingRight: '10px' }}></span>
              <button
              className='button-plain button-confirm'
              onClick={crudDelete} style={{ display:'inline-block' }}>Confirm.</button>
            </div>
          </div>
        </div>) : null
    }
    <div className='row' style={{ whiteSpace:'nowrap' }}>
      <UserLeftSidePanel/>
      <div
        className='col-med panel-style'
        style={{ width: '400px', height:'100vh' }}>
        <div style={{
              width: '100%', height: '100%',
              position: 'relative',
            }}>
          <div style={{ margin: '10% 0 0 10%' }}>
            <div className='map-type-title'>
              My <br/>Saved Maps
            </div>
          </div>
          <div
            className='scrollable'
            style={{
              height: '100vh', overflowX: 'hidden',
              overflowY: 'scroll',
            }}>
            <div style={{ paddingBottom: '40px' }}></div>
            {
              myMaps
              ?
                myMaps.map((_0, i) => {
                  return (
                    <Fragment key={'map-tile-'+i}>
                      <div style={{ position: 'relative' }}>
                        <div
                          className='x-button x-button-map-tile'
                          style={{
                            float: 'right',
                            marginTop: '0px',
                            marginRight: '18px',
                            zIndex: '10',
                            // transform: 'scale(1.35)',
                          }}
                          onClick={() => deleteMap(myMaps[i].id)}>
                          <div
                            style={{ zIndex: '10' }}
                            className='x-button-x-symbol-map-tile'>
                            &#10006;
                          </div>
                          </div>
                          <div
                            onClick={() => {
                              createMap(myMaps[i].type, JSON.parse(myMaps[i].locations))
                              setLabels(myMaps[i].type, JSON.parse(myMaps[i].labels))
                            }}
                            className='my-map-tile map-tile'>
                            <div
                              style={{
                                textAlign: 'left',
                                padding: '8px 0 0 12px',
                              }}
                              className='map-tile-type-title'>{ myMaps[i].type.toUpperCase() }</div>
                            <div
                              className='map-tile-data-container'
                              style={{
                                width: '350px',
                                color: '#777',
                                // backgroundColor: 'red',
                              }}>
                            {
                              myMaps[i].type == 'listview' || myMaps[i].type == 'spidermap'
                              ?
                              <div style={{
                                float: 'left',
                                textAlign: 'left',
                                margin: '0 0 0 12px',
                                // width: '100px',
                                // padding: '4px',
                                display: 'inline-block',
                                // backgroundColor: 'limegreen'
                              }}>
                                Origin: <br/><div style={{ fontSize: '1.35rem' }}> { JSON.parse(myMaps[i].locations)[0] }
                              </div>
                            </div> : null
                            }
                            <div style={{
                                // width: '100px',
                                // float: 'right',
                                textAlign: 'left',
                                display: 'inline-block',
                                // backgroundColor: 'cyan',
                              }}> Destinations:<br/>
                              {
                                myMaps[i].type == 'listview' || myMaps[i].type == 'spidermap'
                                ?
                                  JSON.parse(myMaps[i].locations).map((item, _i) => {
                                    if (_i != 0) {
                                      return (
                                        <Fragment key={'destinations-map-tile-label-'+_i}>
                                          <div style={{
                                              display: 'inline-block'
                                            }}>
                                            &nbsp;{ item }&nbsp;
                                          </div>
                                          {
                                            _i % 5 == 0
                                            ? <><br/></>
                                            : null
                                          }
                                          {
                                            _i == JSON.parse(myMaps[i].locations).length-1
                                            ? <div style={{ paddingBottom: '18px' }}></div>
                                            : null
                                          }
                                        </Fragment>
                                      )
                                    }
                                  })
                                : null
                              }
                              </div>
                            </div>
                          </div>
                        </div>
                    </Fragment>
                  )
                })
              :
                <div
                  className='loading-text'
                  style={{ marginLeft: '15px' }}>Loading saved maps...</div>
            }
            {
              myMaps && myMaps.length == 0
              ?
                <div
                  className='loading-text'
                  style={{ marginLeft: '15px' }}>You haven't created <br/>any maps yet...</div>
              : null
            }
            <div style={{ paddingBottom: '150px' }}></div>
          </div>
        </div>
      </div>
    </div>
  </>)

}

export default withRouter(MyMaps)
