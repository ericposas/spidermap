import React, { useEffect, useState, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import UserLeftSidePanel from '../Views/UserLeftSidePanel'
import { checkAuth, getUser } from '../../sessionStore'
import {
  REMOVE_ORIGIN_LISTVIEW,
  REMOVE_ALL_DESTINATIONS_LISTVIEW,
  SET_ORIGIN_LISTVIEW,
  SET_DESTINATION_LOCATIONS_LISTVIEW,
} from '../../constants/listview'
import {
  SET_ALL_CODES
} from '../../constants/constants'
import axios from 'axios'
import './my-maps.scss'

const MyMaps = ({ ...props }) => {

  const [myMaps, setMyMaps] = useState(null)

  const dispatch = useDispatch()

  const options = useSelector(state => state.allCodesData)

  // const origin = useSelector(state => state.selectedOriginListView)

  // const destinations = useSelector(state => state.selectedDestinationsListView)

  useEffect(() => {
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
    populateCodes()
  }, [])

  const createMap = data => {
    // clear list
    dispatch({ type: REMOVE_ORIGIN_LISTVIEW })
    dispatch({ type: REMOVE_ALL_DESTINATIONS_LISTVIEW })

    console.log(data)

    let origin
    let destinations = []
    // process csv entries
    let _data = data.map(item => item.trim())
    // console.log(_data)
    // _data = _data.filter((item, i) => _data.indexOf(_data[0]) != i)
    options.forEach(option => {
      _data.forEach(datum => {
        if (option.code == _data[0]) origin = option
        else if (option.code == datum) destinations.push(option)
      })
    })
    dispatch({ type: SET_ORIGIN_LISTVIEW, payload: origin })
    dispatch({ type: SET_DESTINATION_LOCATIONS_LISTVIEW, payload: { origin: origin, item: destinations.slice(0, destinations.length) } })

  }

  return (<>
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
              overflowY: 'scroll',
            }}>
            <div style={{ paddingBottom: '40px' }}></div>
            {
              myMaps
              ?
                myMaps.map((_0, i) => {
                  return (
                    <Fragment key={'map-tile-'+i}>
                      <div
                        onClick={() => createMap(JSON.parse(myMaps[i].locations))}
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
                        }}>
                        <div className='map-tile-type-title'>{ myMaps[i].type.toUpperCase() }</div>
                        {
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
                        }
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

export default MyMaps
