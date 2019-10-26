import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import SignIn from './SignIn'
import SignUpPrompt from './SignUpPrompt'
import url from '../../url'
import axios from 'axios'

const LoginPage = ({ ...props }) => {

  const { history } = props

  const [user, setUser] = useState('')

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => handleLoginChange(), [])

  const handleLogout = e => {
    sessionStorage.removeItem(process.env.APP_NAME)
    handleLoginChange()
  }

  const handleLoginChange = () => {
    // check user loggedIn
    let userData = JSON.parse(sessionStorage.getItem(process.env.APP_NAME))
    if (userData) {
      setIsLoggedIn(true)
      setUser(userData.data.user.username)
      // we'll redirect here to a <Dashboard/> Component
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
        isLoggedIn
        ? (<>
            <div>Welcome {user}</div>
            <button style={{float:'right'}} onClick={handleLogout}>logout</button>
           </>)
        : (<>
            <SignIn triggerLoginChange={handleLoginChange}/>
            <br/>
            <SignUpPrompt signUpClickHandler={handleSignUpClick}/>
          </>)
      }
    </>
  )
  
  // if (isLoggedIn) {
  //   return (
  //     <>
  //       <div>Welcome {user}</div>
  //       <button style={{float:'right'}} onClick={handleLogout}>logout</button>
  //     </>
  //   )
  // } else {
  //   return (
  //     <>
  //       <SignIn triggerLoginChange={handleLoginChange}/>
  //       <br/>
  //       <SignUpPrompt signUpClickHandler={handleSignUpClick}/>
  //     </>
  //   )
  // }

}

export default withRouter(LoginPage)
