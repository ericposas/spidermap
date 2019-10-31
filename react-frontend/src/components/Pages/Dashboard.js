import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Dropdown from '../Dropdowns/Dropdown'
import { LAST_LOCATION } from '../../constants/constants'

const Dashboard = ({ ...props }) => {

  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  const { logoutHandler, history } = props

  // const airportsPageButtonHandler = () => {
  //   history.push('/getAirports')
  //   dispatch({ type: LAST_LOCATION, payload: 'dashboard' })
  // }

  const pointmapButtonHandler = () => {
    history.push('/pointmap')
    dispatch({ type: LAST_LOCATION, payload: 'dashboard' })
  }

  const spidermapButtonHandler = () => {
    history.push('/spidermap')
    dispatch({ type: LAST_LOCATION, payload: 'dashboard' })
  }

  const listViewButtonHandler = () => {
    history.push('/listView')
    dispatch({ type: LAST_LOCATION, payload: 'dashboard' })
  }

  const handleLogout = e => {
    sessionStorage.removeItem(process.env.APP_NAME)
    setTimeout(() => {
      dispatch({ type: LAST_LOCATION, payload: 'dashboard' })
      history.push('/')
    }, 0)
  }

  useEffect(() => {
    let sessionData = JSON.parse(sessionStorage.getItem(process.env.APP_NAME))
    if (sessionData) {
      setUser(sessionData.data.user.username)
    } else { history.push('/') }
  }, [])

  return (
    <>
      <div>Welcome {user}</div>
      <br/>
      <button style={{margin:'10px'}}
              className='button-plain'
              onClick={spidermapButtonHandler}>Spider Map</button>
      <button style={{margin:'10px'}}
              className='button-plain'
              onClick={pointmapButtonHandler}>Point-to-Point Map</button>
      <button style={{margin:'10px'}}
              className='button-plain'
              onClick={listViewButtonHandler}>List View</button>
      <button className='button-logout' onClick={handleLogout}>logout</button>
    </>
  )

}

export default withRouter(Dashboard)
