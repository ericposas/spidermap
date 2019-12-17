import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getUser } from '../../sessionStore'
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
import '../../images/globe.png'
import '../../images/pencil.png'
import '../../images/pin.png'
import './dashboard.scss'
import { CSSTransition } from 'react-transition-group'
import axios from 'axios'


const Dashboard = ({ ...props }) => {

  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  const { logoutHandler, history } = props

  const selectedMenuItem = useSelector(state => state.selectedMenuItem)

  const timezoneLatLongs = useSelector(state => state.timezoneLatLongs)

  const [panelSlideActive, setPanelSlideActive] = useState(false)

  const pointmapSelect = () => history.push('/pointmap')

  const pointmapButtonHover = () => {
    if (selectedMenuItem != POINTMAP) {
      dispatch({ type: LAST_LOCATION, payload: 'dashboard' })
      dispatch({ type: POINTMAP })
    }
  }

  const spidermapSelect = () => {
    history.push('/spidermap')
  }

  const spidermapButtonHover = () => {
    if (selectedMenuItem != SPIDERMAP) {
      dispatch({ type: LAST_LOCATION, payload: 'dashboard' })
      dispatch({ type: SPIDERMAP })
    }
  }

  const listViewSelect = () => {
    history.push('/listView')
  }

  const listViewButtonHover = () => {
    if (selectedMenuItem != LISTVIEW) {
      dispatch({ type: LAST_LOCATION, payload: 'dashboard' })
      dispatch({ type: LISTVIEW })
    }
  }

  useEffect(() => {

    const enableLogoutTimer = () => {
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
      // enableLogoutTimer()
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
        <CSSTransition
          unmountOnExit
          in={!selectedMenuItem}
          timeout={300}
          classNames='slide'>
          <div className='col-med panel-style' style={{ width:'400px', height: '100vh' }}>
            <div
              className='subtitle'
              style={{
                color: '#ccc', backgroundColor: '#fff',
                margin: '50% 0 20% 10%', fontWeight: 'lighter'
              }}>
              Dashboard
            </div>
              <button
                  style={{ marginLeft:'10%' }}
                  className='dashboard-menu-button'
                  onClick={() => dispatch({ type: CREATE_A_MAP })}>
                &nbsp;
                <img
                  src='./img/pin.png'
                  style={{
                    display: 'inline-block', width: '30px',
                    marginTop: '-6px', fontWeight: 'lighter'
                  }} />&nbsp;&nbsp; Create A Map
              </button>
              <br/>
              <button
                  style={{ marginLeft:'10%' }}
                  className='dashboard-menu-button'
                  onClick={() => props.history.push('/my-maps')}>
                &nbsp;
                <img
                  src='./img/pencil.png'
                  style={{
                    display: 'inline-block', width: '27px'
                  }} />&nbsp;&nbsp; View / Edit My Maps
              </button>
              <br/>
              <button
                  style={{ marginLeft:'10%', borderBottom: 'none' }}
                  className='dashboard-menu-button'
                  onClick={() => props.history.push('/global-maps')}>
                &nbsp;
                <img
                  src='./img/globe.png'
                  style={{
                    display: 'inline-block', width: '30px',
                    marginTop: '-6px'
                  }} />&nbsp;&nbsp; Global Maps
              </button>
            </div>
        </CSSTransition>
        <CSSTransition
          unmountOnExit
          in={(selectedMenuItem == CREATE_A_MAP || selectedMenuItem == SPIDERMAP ||
           selectedMenuItem == POINTMAP || selectedMenuItem == LISTVIEW)}
          timeout={300}
          classNames='slide'>
          <div className='col-med panel-style' style={{ width:'300px', height: '100vh' }}>
            <div
              className='subtitle'
              style={{
                color: '#ccc', fontWeight: 'lighter',
                margin: '50% 0 20% 10%',
              }}>
              Choose Map Type
            </div>
            <button
              style={{ marginLeft:'10%' }}
              className='dashboard-menu-button'
              onMouseOver={spidermapButtonHover}
              onClick={spidermapSelect}>
              Spider Map
            </button><br/>
            <button
              style={{ marginLeft:'10%' }}
              className='dashboard-menu-button'
              onMouseOver={pointmapButtonHover}
              onClick={pointmapSelect}>
              Point-to-Point Map
            </button><br/>
            <button
              style={{ marginLeft:'10%', borderBottom: 'none' }}
              className='dashboard-menu-button'
              onMouseOver={listViewButtonHover}
              onClick={listViewSelect}>
              List View
            </button>
            <div
              className='col-med panel-style'
              style={{ width:'20px', height: '100vh' }}>
            </div>
          </div>
        </CSSTransition>
        <CSSTransition
          unmountOnExit
          in={ selectedMenuItem == SPIDERMAP }
          timeout={300}
          classNames='slide'>
          <div
            className={`col-med panel-style`}
            style={{
              width:'300px', height: '100vh',
              cursor: 'pointer'
            }}
            onClick={() => props.history.push('/spidermap')}>
            <div
              className='subtitle'
              style={{
                color: '#ccc', margin: '50% 0 20% 10%',
                fontWeight: 'lighter',
              }}>
              { SPIDERMAP }
            </div>
            <div
              className='map-type-icon-container'
              style={{ width: '100%', position: 'relative' }}>
              <div
                style={{
                  display: 'block', position: 'absolute',
                  margin: 'auto', left: 0, right: 0,
                  width: '260px',
                  backgroundSize: '260px',
                  height: '300px', backgroundRepeat: 'no-repeat',
                  backgroundImage: getProperIcon(),
                }}>
              </div><br/><br/>
              <div style={{
                  color: '#999', fontWeight: 'lighter',
                  margin: '180px 0 0 20px',
                }}>
                { SPIDERMAP }
                <div style={{ fontSize: '.6rem' }}>
                  Description here.
                </div>
              </div>
            </div>
          </div>
        </CSSTransition>
        <CSSTransition
          unmountOnExit
          in={ selectedMenuItem == POINTMAP }
          timeout={300}
          classNames='slide'>
          <div
            className={`col-med panel-style`}
            style={{
              width:'300px', height: '100vh',
              cursor: 'pointer'
            }}
            onClick={() => props.history.push('/pointmap')}>
            <div
              className='subtitle'
              style={{
                color: '#ccc', margin: '50% 0 20% 10%',
                fontWeight: 'lighter',
              }}>
              { POINTMAP }
            </div>
            <div
              className='map-type-icon-container'
              style={{ width: '100%', position: 'relative' }}>
              <div
                style={{
                  display: 'block', position: 'absolute',
                  margin: 'auto', left: 0, right: 0,
                  width: '220px', backgroundSize: '220px',
                  height: '300px', backgroundRepeat: 'no-repeat',
                  backgroundImage: getProperIcon(),
                }}>
              </div><br/><br/>
              <div style={{
                  color: '#999', fontWeight: 'lighter',
                  margin: '180px 0 0 20px',
                }}>
                { POINTMAP }
                <div style={{ fontSize: '.6rem' }}>
                  Description here.
                </div>
              </div>
            </div>
          </div>
        </CSSTransition>
        <CSSTransition
          unmountOnExit
          in={ selectedMenuItem == LISTVIEW }
          timeout={300}
          classNames='slide'>
          <div
            className={`col-med panel-style`}
            style={{
              width:'300px', height: '100vh',
              cursor: 'pointer'
            }}
            onClick={() => props.history.push('/listview')}>
            <div
              className='subtitle'
              style={{
                color: '#ccc', margin: '50% 0 20% 10%',
                fontWeight: 'lighter',
              }}>
              { LISTVIEW }
            </div>
            <div
              className='map-type-icon-container'
              style={{ width: '100%', position: 'relative' }}>
              <div
                style={{
                  display: 'block', position: 'absolute',
                  margin: 'auto', left: 0, right: 0,
                  width: '220px', backgroundSize: '220px',
                  height: '300px', backgroundRepeat: 'no-repeat',
                  backgroundImage: getProperIcon(),
                }}>
              </div><br/><br/>
              <div style={{
                  color: '#999', fontWeight: 'lighter',
                  margin: '180px 0 0 20px',
                }}>
                { LISTVIEW }
                <div style={{ fontSize: '.6rem' }}>
                  Description here.
                </div>
              </div>
            </div>
          </div>
        </CSSTransition>
      </div>
    </>
  )

}

export default withRouter(Dashboard)
