import React, { useState, useEffect } from 'react'
import { Redirect, history } from 'react-router'
import { withRouter } from 'react-router-dom'

const TestProtectedRoute = ({ ...props }) => {

  const [appUser, setAppUser] = useState()

  const [isLoggedIn, setIsLoggedIn] = useState()

  const checkLogin = () => {
    let userData = JSON.parse(localStorage.getItem(process.env.APP_NAME))
    if (userData) {
      setIsLoggedIn(true)
      setAppUser(userData.data.user.username)
    } else {
      setIsLoggedIn(false)
      setTimeout(() => props.history.push('/'), 2000)
    }
  }

  useEffect(() => checkLogin(), [])

  if (isLoggedIn) {
    return (
      <>
        <div>Here is a protected test route, "{appUser}" -- You're only able to see this because you are logged in as "{appUser}"</div>
      </>
    )
  } else {
    return (
      <>
        <div>This is a protected route, you will be redirected now...</div>
      </>
    )
  }

}

export default withRouter(TestProtectedRoute)
