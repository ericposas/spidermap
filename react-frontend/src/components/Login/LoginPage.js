import React, { useState, useEffect } from 'react'
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

  useEffect(() => handleLoginChange(), [isLoggedIn])

  const handleLogout = e => {
    sessionStorage.removeItem(process.env.APP_NAME)
    handleLoginChange()
    setIfLoggedOut(true)
    setTimeout(() => setIfLoggedOut(false), 1500)
  }

  const handleLoginChange = () => {
    // check user loggedIn
    let userData = JSON.parse(sessionStorage.getItem(process.env.APP_NAME))
    if (userData) {
      setIsLoggedIn(true)
      setUser(userData.data.user.username)
    } else {
      setIsLoggedIn(false)
      setUser('')
    }
  }

  const handleSignUpClick = () => {
    history.push('/signUp')
  }

  return (
    <>
      {
        ifLoggedOut
        ? (<>
            <div className='modal-loggedout'>You've been logged out.</div>
          </>)
        : ''
      }
      {
        isLoggedIn
        ? <Dashboard user={user} logoutHandler={handleLogout}/>
        : <>
            <SignIn triggerLoginChange={handleLoginChange}/>
            <br/>
            <SignUpPrompt signUpClickHandler={handleSignUpClick}/>
          </>
      }
    </>
  )

}

export default withRouter(LoginPage)
