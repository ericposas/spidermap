import React, { useState, useEffect } from 'react'
import SignIn from './SignIn'
import url from '../../url'
import axios from 'axios'
// import SignUp from './SignUp'

const LoginPage = ({ ...props }) => {

  const [user, setUser] = useState('')

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => handleLoginChange(), [])

  const handleLogout = e => {
    localStorage.removeItem(process.env.APP_NAME)
    handleLoginChange()
  }

  const handleLoginChange = () => {
    // check user loggedIn
    let userData = JSON.parse(localStorage.getItem(process.env.APP_NAME))
    console.log(userData)
    if (userData) {
      setIsLoggedIn(true)
      setUser(userData.data.user.username)
    } else {
      setIsLoggedIn(false)
      setUser('')
    }
  }

  if (isLoggedIn) {
    return (
      <>
        <div>Welcome {user}</div>
        <button style={{float:'right'}} onClick={handleLogout}>logout</button>
      </>
    )
  } else {
    return (
      <>
        <SignIn triggerLoginChange={handleLoginChange}/>
        <br/>
        {/*<SignUp/>*/}
      </>
    )
  }

}

export default LoginPage
