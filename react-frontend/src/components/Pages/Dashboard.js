import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Dropdown from '../Dropdowns/Dropdown'
import { LAST_LOCATION } from '../../constants/constants'

const Dashboard = ({ ...props }) => {

  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  const { logoutHandler, history } = props

  const airportsPageButtonHandler = () => {
    history.push('/getAirports')
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
    if (sessionData) setUser(sessionData.data.user.username)
    else history.push('/')
  }, [])

  return (
    <>
      <div>Welcome {user}</div>
      <div>See airports list</div>
      <button className='button-plain' onClick={airportsPageButtonHandler}>Airports</button>
      <button className='button-logout' onClick={handleLogout}>logout</button>
      <br/>
      <br/>
      <div>Testing Search bars..</div>
      <div style={{display:'inline-block'}}>search by airport code: &nbsp;</div><Dropdown type='code'/><br/>
      <div style={{display:'inline-block'}}>search by region: &nbsp;</div><Dropdown type='category'/>

    </>
  )

}

export default withRouter(Dashboard)