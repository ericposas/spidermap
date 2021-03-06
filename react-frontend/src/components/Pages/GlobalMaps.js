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
  SET_LISTVIEW_CURRENTLY_EDITING
} from '../../constants/listview'
import {
  REMOVE_ORIGIN_SPIDERMAP,
  REMOVE_ALL_DESTINATIONS_SPIDERMAP,
  SET_ORIGIN_SPIDERMAP,
  SET_DESTINATION_LOCATIONS_SPIDERMAP,
  SET_ALL_LABEL_POSITIONS_SPIDERMAP,
  SET_ALL_LABEL_DISPLAY_TYPES_SPIDERMAP,
  SET_SPIDERMAP_DISTLIMIT,
  SET_SPIDERMAP_RENDERTYPE,
  SET_SPIDERMAP_ANGLEADJUST,
  SET_SPIDERMAP_CURRENTLY_EDITING,
} from '../../constants/spidermap'
import {
  CLEAR_ORIGIN_LOCATIONS_POINTMAP,
  SET_DESTINATION_LOCATIONS_POINTMAP_AT_ONCE,
  SET_ORIGIN_LOCATIONS_POINTMAP,
  SET_ALL_LABEL_POSITIONS_POINTMAP,
  SET_ALL_LABEL_DISPLAY_TYPES_POINTMAP,
  SET_POINTMAP_CURRENTLY_EDITING
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
import { CSSTransition } from 'react-transition-group'

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
    axios.get(`/globalmaps`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
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
           setTimeout(() => setShowMapDeleted_Notification(false), 500)
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

  const setLabels = (type, data, otherData) => {
    switch (type) {
      case 'spidermap':
        setLabelsAndPositionsSpidermap(data, otherData)
        break;
      case 'pointmap':
        setLabelsAndPositionsPointmap(data, otherData)
        break;
      case 'listview':
        dispatch({ type: SET_LISTVIEW_CURRENTLY_EDITING, payload: { name: otherData.name, id: otherData.id } })
        break;
      default:
        setLabelsAndPositionsSpidermap(data, otherData)
    }
  }

  const setLabelsAndPositionsSpidermap = (data, otherData) => {
    batch(() => {
      dispatch({ type: SET_ALL_LABEL_POSITIONS_SPIDERMAP, payload: data.positions })
      dispatch({ type: SET_ALL_LABEL_DISPLAY_TYPES_SPIDERMAP, payload: data.displayTypes })
      dispatch({ type: SET_SPIDERMAP_DISTLIMIT, payload: otherData.distlimit })
      dispatch({ type: SET_SPIDERMAP_RENDERTYPE, payload: otherData.rendertype })
      dispatch({ type: SET_SPIDERMAP_ANGLEADJUST, payload: otherData.angleadjust })
      dispatch({ type: SET_SPIDERMAP_CURRENTLY_EDITING, payload: { name: otherData.name, id: otherData.id } })
    })
  }

  const setLabelsAndPositionsPointmap = (data, otherData) => {
    batch(() => {
      dispatch({ type: SET_ALL_LABEL_POSITIONS_POINTMAP, payload: data.positions })
      dispatch({ type: SET_ALL_LABEL_DISPLAY_TYPES_POINTMAP, payload: data.displayTypes })
      dispatch({ type: SET_POINTMAP_CURRENTLY_EDITING, payload: { name: otherData.name, id: otherData.id } })
    })
  }

  useEffect(() => {
    if (!checkAuth()) {
      props.history.push('/')
    } else {
      populateCodes()
    }
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
    <CSSTransition
      in={confirmDeleteModal}
      unmountOnExit
      timeout={300}
      classNames='alert'>
        <div
          className='modal-confirm-delete-backing'>
          <div className='modal-confirm-delete'>
              <div
                className='x-button-maps-modal'
                onClick={() => setConfirmDeleteModal(false)}>
                <div className='x-button-x-symbol'>&#10006;</div>
              </div>
            <div
              onClick={()=>{}}
              className='modal-confirm-yes-no-button-container'>
              <div>Are you sure that you want to delete this map? <span style={{opacity:0}}>{ mapIdToDelete }</span></div>
              <div
              className='delete-decline-text'
              onClick={() => setConfirmDeleteModal(false)} style={{ display:'inline-block' }}>Nevermind.</div>
              <span style={{ paddingRight: '10px' }}></span>
              <div
              className='delete-confirm-text'
              onClick={crudDelete} style={{ display:'inline-block' }}>Confirm.</div>
            </div>
          </div>
        </div>
    </CSSTransition>
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
              Global <br/>Saved Maps
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
              globalMaps
              ?
                globalMaps.map((_0, i) => {
                  return (
                    <Fragment key={'map-tile-'+i}>
                      <div style={{ position: 'relative' }}>
                        <div
                          onClick={() => {
                            createMap(globalMaps[i].type, globalMaps[i].locations ? JSON.parse(globalMaps[i].locations) : [])
                            setLabels(
                              globalMaps[i].type,
                              globalMaps[i].labels ? JSON.parse(globalMaps[i].labels) : null,
                              {
                                id: globalMaps[i]._id,
                                name: globalMaps[i].name || '',
                                distlimit: globalMaps[i].distlimit || null,
                                angleadjust: globalMaps[i].angleadjust || null,
                                rendertype: globalMaps[i].rendertype || null
                              }
                            )
                          }}
                          className='my-map-tile map-tile'>
                          <div
                            style={{
                              textAlign: 'left',
                              padding: '8px 0 0 12px',
                            }}
                            className='map-tile-type-title'>
                              { globalMaps[i].type.toUpperCase() }
                              <div>
                                {(globalMaps[i].name || 'map not labeled')}
                                <br/>
                                <br/>
                              </div>
                          </div>
                          <div
                            className='map-tile-data-container'
                            style={{
                              width: '350px',
                              color: '#777',
                            }}>
                          {
                            globalMaps[i].type == 'listview' || globalMaps[i].type == 'spidermap'
                            ?
                              <div style={{
                                float: 'left',
                                textAlign: 'left',
                                margin: '0 0 0 12px',
                                display: 'inline-block',
                              }}>
                                Origin: <br/>
                                <div style={{ fontSize: '1.35rem' }}>
                                  { globalMaps[i].locations ? JSON.parse(globalMaps[i].locations)[0] : null }
                                </div>
                              </div>
                            : null
                          }
                          {
                            globalMaps[i].type == 'listview' || globalMaps[i].type == 'spidermap'
                            ?
                              <div
                                style={{
                                  textAlign: 'left',
                                  display: 'inline-block',
                                }}> Destinations:<br/>
                                  {
                                    globalMaps[i].locations
                                    ?
                                    JSON.parse(globalMaps[i].locations).map((item, _i) => {
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
                                              _i == JSON.parse(globalMaps[i].locations).length-1
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
                            :
                                globalMaps[i].locations
                                ?
                                JSON.parse(globalMaps[i].locations).map((destArr, _i) => {
                                    return (
                                      <div
                                        key={'pointmap-tile-'+destArr[_i]+_i}
                                        style={{
                                          textAlign: 'left',
                                        }}>
                                        <div
                                          style={{
                                            float: 'left',
                                            textAlign: 'left',
                                            margin: '0 0 0 12px',
                                            display: 'inline-block',
                                            width: '100px'
                                          }}>
                                          Origin: <br/>
                                          <div style={{ fontSize: '1.35rem' }}>
                                            { destArr[0] }
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            textAlign: 'left',
                                            margin: '0 0 0 12px',
                                            display: 'inline-block',
                                          }}>
                                          Destinations: <br/>
                                        {
                                          destArr.map((item, __i) => {
                                            if (__i != 0) {
                                              return (
                                                <Fragment key={'destinations-map-tile-label-'+__i}>
                                                  <div
                                                    style={{
                                                      textAlign: 'left',
                                                      display: 'inline-block',
                                                    }}>
                                                    &nbsp;{ item }&nbsp;
                                                  </div>
                                                  {
                                                    __i % 5 == 0
                                                    ? <><br/></>
                                                    : null
                                                  }
                                                  {
                                                    __i == destArr.length-1
                                                    ? <div style={{ paddingBottom: '18px' }}></div>
                                                    : null
                                                  }
                                                </Fragment>
                                              )
                                            }
                                          })
                                        }
                                      </div>
                                    </div>
                                  )
                                })
                                : null
                            }
                            </div>
                          </div>
                          {
                            getUser().user.isadmin == true
                            ?
                              <div
                                className='x-button x-button-map-tile'
                                style={{
                                  top: 0, right: '24px',
                                  position: 'absolute',
                                  zIndex: '10',
                                  width: '10px',
                                }}
                                onClick={() => deleteMap(globalMaps[i].id)}>
                                <div
                                  style={{ zIndex: '10' }}
                                  className='x-button-x-symbol-map-tile'>
                                  &#10006;
                                </div>
                              </div>
                            : null
                          }
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
              globalMaps && globalMaps.length == 0
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

export default withRouter(GlobalMaps)
