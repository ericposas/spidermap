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
  SET_ALL_CODES,
  LAST_LOCATION,
} from '../../constants/constants'
import axios from 'axios'
import './my-maps.scss'
import '../Buttons/buttons.scss'

const MyMaps = ({ ...props }) => {

  const [myMaps, setMyMaps] = useState(null)

  const [confirmDeleteModal, setConfirmDeleteModal] = useState(null)

  const [mapIdToDelete, setMapIdToDelete] = useState(null)

  const dispatch = useDispatch()

  const options = useSelector(state => state.allCodesData)

  const populateCodes = () => {
    axios.get(`/airports/byCode`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
       .then(data => {
         dispatch({ type: SET_ALL_CODES, payload: data.data })
         getMyMaps()
       })
       .catch(err => console.log(err))
  }
  const getMyMaps = () => {
    axios.get('/mymaps', { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
         .then(data => {
           setMyMaps(data.data)
         })
         .catch(err => console.log(err))
  }

  useEffect(() => {
    populateCodes()
  }, [])

  const createMap = (type, data) => {
    switch (type) {
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

  const crudDelete = () => {
    axios.delete(`/mymaps/${mapIdToDelete}`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
         .then(result => {
           getMyMaps()
           setConfirmDeleteModal(false)
         })
         .catch(err => console.log(err))
  }

  const deleteMap = id => {
    // show modal before user confirms deletion
    setConfirmDeleteModal(true)
    setMapIdToDelete(id)
  }

  return (<>
    {
      confirmDeleteModal
      ?
        (<div
          style={{
            display: 'block',
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.35)',
            filter: 'blur(1.5)',
            width: '100%',
            height: '100%',
            zIndex: 200,
          }}
          className='modal-confirm-delete-backing'>
          <div
            style={{
              display: 'block',
              position: 'absolute',
              width: '50%',
              height: '40%',
              margin: 'auto',
              left: 0, right: 0,
              top: 0, bottom: 0,
              backgroundColor: '#fff',
              borderRadius: '4px',
              zIndex: 201,
            }}
            className='modal-confirm-delete'>
              <div
                className='x-button'
                style={{
                  float: 'right',
                  marginTop: '-4px',
                  marginRight: '-4px',
                  transform: 'scale(1.35)',
                }}
                onClick={() => setConfirmDeleteModal(false)}>
                <div
                  className='x-button-x-symbol'>
                  x
                </div>
              </div>
            <div
              style={{
                display: 'block',
                position: 'absolute',
                width: '60%',
                height: '60%',
                margin: 'auto',
                top: 0, bottom: 0,
                left: 0, right: 0,
                textAlign: 'center',
              }}
             className='modal-confirm-yes-no-button-container'>
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
              My <br/>Saved Maps
            </div>
          </div>
          <div
            style={{
              height: '100vh',
              overflowX: 'hidden',
              overflowY: 'scroll',
            }}>
            <div style={{ paddingBottom: '40px' }}></div>
            {
              myMaps
              ?
                myMaps.map((_0, i) => {
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
                          onClick={() => deleteMap(myMaps[i].id)}>
                          <div
                            style={{
                              color: '#CC271E',
                              borderColor: '#CC271E',
                            }}
                            className='x-button-x-symbol-map-tile x-button-x-symbol'>x</div>
                          </div>
                          <div
                            onClick={() => createMap(myMaps[i].type, JSON.parse(myMaps[i].locations))}
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
                            <div className='map-tile-type-title'>{ myMaps[i].type.toUpperCase() }</div>
                            {
                              myMaps[i].type == 'listview' || myMaps[i].type == 'spidermap'
                              ?
                              JSON.parse(myMaps[i].locations).map((item, _i) => {
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
                              : null
                            }
                          </div>
                        </div>
                    </Fragment>
                  )
                })
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
