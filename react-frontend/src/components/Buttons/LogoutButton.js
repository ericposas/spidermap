import React from 'react'
import { useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { LAST_LOCATION } from '../../constants/constants'

const LogoutButton = ({ ...props }) => {

  const dispatch = useDispatch()

  const handleLogout = e => {
    sessionStorage.removeItem(process.env.APP_NAME)
    let path = props.history.location.pathname
    path = path.substr(1, path.length)
    setTimeout(() => {
      dispatch({ type: LAST_LOCATION, payload: path })
      props.history.push('/')
    }, 0)
  }

  return (
    <button className='button-logout' onClick={handleLogout}>logout</button>
  )

}

export default withRouter(LogoutButton)
