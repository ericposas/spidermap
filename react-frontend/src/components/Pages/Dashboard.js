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
      <br/>
      <div style={{display:'inline-block'}}>select Origin by airport code: &nbsp;</div>
      <Dropdown type='code' output='origin'/>
      <br/>
      <br/>
      <div style={{display:'inline-block'}}>select Origins by airport code: &nbsp;</div>
      <Dropdown type='code' output='origins'/>
      <br/>
      <div style={{display:'inline-block'}}>select Origins by category: &nbsp;</div>
      <Dropdown type='category' output='origins'/>
      <br/>
      <br/>
      <div style={{display:'inline-block'}}>select Destinations by airport code: &nbsp;</div>
      <Dropdown type='code' output='destinations'/>
      <br/>
      <div style={{display:'inline-block'}}>select Destinations by category: &nbsp;</div>
      <Dropdown type='category' output='destinations'/>

    </>
  )

}

export default withRouter(Dashboard)
