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
} from '../../constants/spidermap'
import {
  CLEAR_ORIGIN_LOCATIONS_POINTMAP,
  SET_DESTINATION_LOCATIONS_POINTMAP_AT_ONCE,
  SET_ORIGIN_LOCATIONS_POINTMAP,
} from '../../constants/pointmap'
import {
  SET_ALL_CODES,
  LAST_LOCATION,
  SET_GLOBAL_MAPS,
} from '../../constants/constants'
import axios from 'axios'
import './my-maps.scss'
import '../Buttons/buttons.scss'
import '../Modals/confirm-delete-modal.scss'

const GlobalMaps = ({ ...props }) => {

  const globalMaps = useSelector(state => state.globalMaps)

  const allCodesData = useSelector(state => state.allCodesData)

  const [confirmDeleteModal, setConfirmDeleteModal] = useState(null)

  const [mapIdToDelete, setMapIdToDelete] = useState(null)

  const dispatch = useDispatch()

  const options = useSelector(state => state.allCodesData)

  const [showDeletingMapFromDB_Notification, setShowDeletingMapFromDB_Notification] = useState(false)

  const [showMapDeleted_Notification, setShowMapDeleted_Notification] = useState(false)

  const populateCodes = () => {
    if (!allCodesData) {
      axios.get(`/airports/byCode`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
           .then(data => {
             dispatch({ type: SET_ALL_CODES, payload: data.data })
             getGlobalMaps()
           })
           .catch(err => console.log(err))
    } else {
      getGlobalMaps()
    }
  }

  const getGlobalMaps = (force = false) => {
    axios.get('/globalmaps', { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
         .then(data => {
           dispatch({ type: SET_GLOBAL_MAPS, payload: data.data })
           if (showMapDeleted_Notification) setShowMapDeleted_Notification(false)
         })
         .catch(err => console.log(err))
  }

  const crudDelete = () => {
    setShowDeletingMapFromDB_Notification(true)
    axios.delete(`/globalmaps/${mapIdToDelete}`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
         .then(result => {
           setShowDeletingMapFromDB_Notification(false)
           setShowMapDeleted_Notification(true)
           setTimeout(() => setShowMapDeleted_Notification(false), 2000)
           setConfirmDeleteModal(false)
           getGlobalMaps()
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
      dispatch({ type: LAST_LOCATION, payload: 'global-maps' })
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
      dispatch({ type: LAST_LOCATION, payload: 'global-maps' })
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
      dispatch({ type: LAST_LOCATION, payload: 'global-maps' })
    })
    props.history.push('/generate-listview')
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
      <div className='col-med' style={{
          width:'200px',
          height:'100vh',
          backgroundColor: '#fff',
          boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
        }}>
        <div style={{
              width: '100%',
              height: '100%',
              position: 'relative',
          }}>
          <div style={{
            margin: '10% 0 0 10%',
          }}>
            <div className='map-type-title'>
              Global <br/>Saved Maps
            </div>
          </div>
          <div
            className='scrollable'
            style={{
              height: '100vh',
              overflowX: 'hidden',
              overflowY: 'scroll',
            }}>
            <div style={{ paddingBottom: '40px' }}></div>
            {
              globalMaps
              ?
                globalMaps.map((_0, i) => {
                  return (
                    <Fragment key={'map-tile-'+i}>
                      <div>
                        <div
                          className='x-button x-button-map-tile'
                          style={{
                            float: 'right',
                            marginTop: '-4px',
                            marginRight: '8px',
                            transform: 'scale(1.35)',
                          }}
                          onClick={() => deleteMap(globalMaps[i].id)}>
                          <div
                            style={{
                              color: '#CC271E',
                              borderColor: '#CC271E',
                            }}
                            className='x-button-x-symbol-map-tile x-button-x-symbol'>x</div>
                          </div>
                          <div
                            onClick={() => createMap(globalMaps[i].type, JSON.parse(globalMaps[i].locations))}
                            className='my-map-tile'
                            style={{
                              textAlign: 'center',
                              fontSize: '.8rem',
                              margin: '4% 5% 0 5%',
                              paddingBottom: '4px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              color: '#006CC4',
                              backgroundColor: '#fff',
                              border: '2px solid #006CC4',
                              width: '90%',
                            }}>
                            <div className='map-tile-type-title'>{ globalMaps[i].type.toUpperCase() }</div>
                            {
                              globalMaps[i].type == 'listview' || globalMaps[i].type == 'spidermap'
                              ?
                              JSON.parse(globalMaps[i].locations).map((item, _i) => {
                                if (_i == 0) {
                                  return (<Fragment key={'origin-map-tile-label-'+_i}>
                                    <div style={{
                                      margin: '2px',
                                      padding: '4px',
                                      display: 'inline-block',
                                    }}>
                                    <span style={{ fontSize: '.95rem' }}>Origin: <span style={{ fontSize: '.8rem' }}>{ item }</span></span>
                                    </div>
                                  </Fragment>)
                                } else {
                                  return (<Fragment key={'destinations-map-tile-label-'+_i}>
                                  { _i == 1 ? (<div style={{paddingLeft:'5px',fontSize: '.95rem',}}>Destinations:</div>) : null }
                                  <span style={{
                                      margin: '2px',
                                      padding: '4px',
                                    }}>
                                    <span style={{ fontSize: '.8rem' }}>{ item }</span>
                                  </span>
                                  { _i % 4 == 0 ? (<br/>) : null }
                                  </Fragment>)
                                }
                              })
                              :
                                JSON.parse(globalMaps[i].locations).map((destArr, _i) => {
                                  return destArr.map((item, __i) => {
                                    if (__i == 0) {
                                      return (<Fragment key={'origin-map-tile-label-'+__i}>
                                        <div style={{
                                          margin: '2px',
                                          padding: '4px',
                                          display: 'inline-block',
                                        }}>
                                        <span style={{ fontSize: '.95rem' }}>Origin: <span style={{ fontSize: '.8rem' }}>{ item }</span></span>
                                        </div>
                                      </Fragment>)
                                    } else {
                                      return (<Fragment key={'destinations-map-tile-label-'+__i}>
                                      { __i == 1 ? (<div style={{paddingLeft:'5px',fontSize: '.95rem',}}>Destinations:</div>) : null }
                                      <span style={{
                                          margin: '2px',
                                          padding: '4px',
                                        }}>
                                        <span style={{ fontSize: '.8rem' }}>{ item }</span>
                                      </span>
                                      { __i % 4 == 0 ? (<br/>) : null }
                                      { __i == destArr.length-1 ? (<><br/><br/></>) : null }
                                      </Fragment>)
                                    }
                                  })
                                })
                            }
                          </div>
                        </div>
                    </Fragment>
                  )
                })
              : <div
                  className='loading-text'
                  style={{
                    marginLeft: '15px'
                  }}>Loading Global maps...</div>
            }
            <div style={{ paddingBottom: '150px' }}></div>
          </div>
        </div>
      </div>
    </div>
  </>)

}

export default withRouter(GlobalMaps)
