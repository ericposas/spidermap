import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Dropdown from '../Dropdowns/Dropdown'
import LogoutButton from '../Buttons/LogoutButton'
import UserLeftSidePanel from '../Views/UserLeftSidePanel'
import { LAST_LOCATION } from '../../constants/constants'
import {
  SPIDERMAP,
  POINTMAP,
  LISTVIEW,
  CREATE_A_MAP,
  EDIT_VIEW_MY_MAPS,
  GLOBAL_MAPS,
} from '../../constants/menu'
import '../../images/listview-icon.png'
import '../../images/point-to-point-icon.png'
import '../../images/spidermap-icon.png'


const Dashboard = ({ ...props }) => {

  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  const { logoutHandler, history } = props

  const selectedMenuItem = useSelector(state => state.selectedMenuItem)

  const pointmapSelect = () => {
    history.push('/pointmap')
    dispatch({ type: LAST_LOCATION, payload: 'dashboard' })
  }

  const pointmapButtonClick = () => {
    dispatch({ type: POINTMAP })
  }

  const spidermapSelect = () => {
    history.push('/spidermap')
    dispatch({ type: LAST_LOCATION, payload: 'dashboard' })
  }

  const spidermapButtonClick = () => {
    dispatch({ type: SPIDERMAP })
  }

  const listViewSelect = () => {
    history.push('/listView')
    dispatch({ type: LAST_LOCATION, payload: 'dashboard' })
  }

  const listViewButtonClick = () => {
    dispatch({ type: LISTVIEW })
  }

  useEffect(() => {

    const enableLogoutTimer = () => {
      // uncomment below to enable auto-logout function
      let logoutTimer, timeLength = (60 * 1000 * 15)
      const setLogoutTimer = () => {  // auto logout timer -- 15 minutes
        if (logoutTimer) clearTimeout(logoutTimer)
        if (sessionStorage.getItem(process.env.APP_NAME)) {
          logoutTimer = setTimeout(() => {
            sessionStorage.removeItem(process.env.APP_NAME)
            dispatch({ type: LAST_LOCATION, payload: 'autologout' })
            history.push('/')
          }, timeLength)
          console.log('timer reset to auto-logout in 15 minutes')
        } else {
          console.log('not logged in')
        }
      }
      setLogoutTimer()
      window.onmousemove = () => setLogoutTimer()
    }

    let sessionData = JSON.parse(sessionStorage.getItem(process.env.APP_NAME))
    if (sessionData) {
      setUser(sessionData.data.user.username)
      enableLogoutTimer()
    } else {
      history.push('/')
    }

  }, [])

  const getProperIcon = () => {
    switch (selectedMenuItem) {
      case SPIDERMAP:
        return 'url(./img/spidermap-icon.png)'
        break
      case POINTMAP:
        return 'url(./img/point-to-point-icon.png)'
        break
      case LISTVIEW:
        return 'url(./img/listview-icon.png)'
        break
      default:
        return ''
    }
  }

  return (
    <>
      <div className='row' style={{whiteSpace:'nowrap'}}>
        <UserLeftSidePanel/>
        {/* Create a Main Menu */}
        {
          !selectedMenuItem
          ?
          (<div className='col-med' style={{
              width:'300px',
              height: '100vh',
              backgroundColor: '#fff',
              boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
            }}>
            <div
                className='subtitle'
                style={{
                  color: '#ccc',
                  margin: '50% 0 20% 10%',
                  backgroundColor: '#fff',
                  fontWeight: 'lighter',
                }}>
              Dashboard
            </div>
              <button
                  style={{ marginLeft:'10%' }}
                  className='dashboard-menu-button'
                  onClick={() => dispatch({ type: CREATE_A_MAP })}>
                Create A Map
              </button>
              <br/>
              <button
                  style={{ marginLeft:'10%' }}
                  className='dashboard-menu-button'
                  onClick={() => props.history.push('/my-maps')}>
                View / Edit My Maps
              </button>
              <br/>
              <button
                  style={{ marginLeft:'10%', borderBottom: 'none' }}
                  className='dashboard-menu-button'>
                Global Maps
              </button>
            </div>)
            : null
        }
        {/* Create a Map selection menu */}
        {
          selectedMenuItem == CREATE_A_MAP ||
          selectedMenuItem == SPIDERMAP ||
          selectedMenuItem == POINTMAP ||
          selectedMenuItem == LISTVIEW
          ?
           (<>
            <div className='col-med' style={{
              width:'300px',
              height: '100vh',
              backgroundColor: '#fff',
              boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
            }}>
            <div
              className='subtitle'
              style={{
                color: '#ccc',
                margin: '50% 0 20% 10%',
                fontWeight: 'lighter'
              }}>Choose Map Type</div>
              <button
                style={{ marginLeft:'10%' }}
                className='dashboard-menu-button'
                onClick={spidermapButtonClick}>Spider Map</button><br/>
              <button
                style={{ marginLeft:'10%' }}
                className='dashboard-menu-button'
                onClick={pointmapButtonClick}>Point-to-Point Map</button><br/>
              <button
                style={{ marginLeft:'10%', borderBottom: 'none' }}
                className='dashboard-menu-button'
                onClick={listViewButtonClick}>List View</button>
            </div>
            {
              selectedMenuItem == SPIDERMAP ||
              selectedMenuItem == POINTMAP ||
              selectedMenuItem == LISTVIEW
              ?
               (<div
                  className='col-med'
                  style={{
                    width:'300px',
                    height: '100vh',
                    cursor: 'pointer',
                    backgroundColor: '#fff',
                    boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
                  }}
                  onClick={
                    () => {
                      switch (selectedMenuItem) {
                        case SPIDERMAP:
                          props.history.push('/spidermap')
                          break;
                        case POINTMAP:
                          props.history.push('/pointmap')
                          break;
                        case LISTVIEW:
                          props.history.push('/listview')
                          break;
                        default:
                          props.history.push('dashboard')
                          break;
                      }
                    }
                  }>
               <div
                 className='subtitle'
                 style={{
                   color: '#ccc',
                   margin: '50% 0 20% 10%',
                   fontWeight: 'lighter',
                 }}>{selectedMenuItem.charAt(0)+selectedMenuItem.substr(1, selectedMenuItem.length).toLowerCase()}</div>
               <div
                 className='map-type-icon-container'
                 style={{
                   width: '100%',
                   position: 'relative',

                 }}>
                 <div
                   style={{
                     display: 'block',
                     position: 'absolute',
                     margin: 'auto',
                     left: 0, right: 0,
                     width: selectedMenuItem == LISTVIEW ? '200px' : selectedMenuItem == POINTMAP ? '220px' : '260px',
                     height: '300px',
                     backgroundSize: selectedMenuItem == LISTVIEW ? '200px' : selectedMenuItem == POINTMAP ? '220px' : '260px',
                     backgroundRepeat: 'no-repeat',
                     backgroundImage: getProperIcon(),
                   }}>
                 </div>
                 <br/>
                 <br/>
                 <div
                   style={{
                     color: '#999',
                     fontWeight: 'lighter',
                     margin: '180px 0 0 20px',
                   }}>
                   { selectedMenuItem }
                   <div
                     style={{
                       fontSize: '.6rem'
                     }}>
                     Description here.
                   </div>
                 </div>
               </div>
               </div>)
               :
                 (
                   <div
                     className='col-med'
                     style={{
                       width:'20px',
                       height: '100vh',
                       backgroundColor: '#fff',
                       boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
                     }}>
                     {/* empty */}
                   </div>
                 )
            }
            </>)
            : null
        }
      </div>
    </>
  )

}

export default withRouter(Dashboard)
