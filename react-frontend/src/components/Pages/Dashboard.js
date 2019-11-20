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

const Dashboard = ({ ...props }) => {

  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  const { logoutHandler, history } = props

  // const [selectedMenuItem, setSelectedMenuItem] = useState(null)

  const selectedMenuItem = useSelector(state => state.selectedMenuItem)

  const pointmapSelect = () => {
    history.push('/pointmap')
    dispatch({ type: LAST_LOCATION, payload: 'dashboard' })
  }

  const pointmapButtonClick = () => {

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

  }

  useEffect(() => {
    let sessionData = JSON.parse(sessionStorage.getItem(process.env.APP_NAME))
    if (sessionData) {
      setUser(sessionData.data.user.username)
    } else { history.push('/') }
  }, [])

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
              boxShadow: '10px 0 15px -10px rgba(0,0,0,0.2)',
            }}>
            <div
                className='subtitle'
                style={{
                  color: '#ccc',
                  margin: '40% 0 0 10%'
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
                  className='dashboard-menu-button'>
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
              boxShadow: '10px 0 15px -10px rgba(0,0,0,0.2)',
            }}>
            <div
              className='subtitle'
              style={{
                color: '#ccc',
                margin: '40% 0 0 10%'
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
              selectedMenuItem == SPIDERMAP
              ?
               (<div className='col-med' style={{
                 width:'300px',
                 height: '100vh',
                 boxShadow: '10px 0 15px -10px rgba(0,0,0,0.2)',
               }}>
               <div
                 className='subtitle'
                 style={{
                   color: '#ccc',
                   margin: '40% 0 0 10%'
                 }}>Spidermap</div>

               </div>)
               :
                 (
                   <div className='col-med' style={{
                       width:'20px',
                       height: '100vh',
                       boxShadow: '5px 0 15px -5px rgba(0,0,0,0.15)',
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
