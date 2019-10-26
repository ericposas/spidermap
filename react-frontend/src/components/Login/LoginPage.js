import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SignIn from './SignIn'
import SignUpPrompt from './SignUpPrompt'
import Dashboard from '../Pages/Dashboard'
import url from '../../url'
import axios from 'axios'

const LoginPage = ({ ...props }) => {

  const { history } = props

  const [user, setUser] = useState('')

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [ifLoggedOut, setIfLoggedOut] = useState(false)

  const dispatch = useDispatch()

  const lastLocation = useSelector(state => state.lastLocation)

  useEffect(() => handleLoginChange(), [])

  // const handleLogout = e => {
  //   sessionStorage.removeItem(process.env.APP_NAME)
  //   handleLoginChange()
  //   setIfLoggedOut(true)
  //   setTimeout(() => setIfLoggedOut(false), 1500)
  // }

  const handleLoginChange = () => {
    // check user loggedIn
    let userData = JSON.parse(sessionStorage.getItem(process.env.APP_NAME))
    if (userData) {
      setIsLoggedIn(true)
      dispatch({ type: 'LAST_LOCATION', payload: 'login' })
      history.push('/dashboard')
      // <Dashboard user={user} logoutHandler={handleLogout}/>
      // setUser(userData.data.user.username)
    } else {
      // show user logged out if done so recently
      if (lastLocation) { setIfLoggedOut(true); setTimeout(() => setIfLoggedOut(false), 1500); }
      setIsLoggedIn(false)
      // setUser('')
    }
  }

  const handleSignUpClick = () => {
    history.push('/signUp')
    dispatch({ type: 'LAST_LOCATION', payload: 'login' })
  }

  return (
    <>
      {
        ifLoggedOut
        ? (<><div className='modal-loggedout'>logged out.</div></>)
        : ''
      }
      {
        !isLoggedIn
        ? (<>
            <SignIn triggerLoginChange={handleLoginChange}/>
            <br/>
            <SignUpPrompt signUpClickHandler={handleSignUpClick}/>
          </>) : ''
      }
    </>
  )

}

export default withRouter(LoginPage)
