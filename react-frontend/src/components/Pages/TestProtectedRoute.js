import React, { useState, useEffect } from 'react'
import { Redirect, history } from 'react-router'
import { withRouter } from 'react-router-dom'
// import { getUser, checkAuth } from '../../localStore'

const TestProtectedRoute = ({ ...props }) => {

  const [appUser, setAppUser] = useState()

  const [isLoggedIn, setIsLoggedIn] = useState()

  // const routeRedirect = () => {
  //   console.log('user is not authenticated!')
  //   setTimeout(() => { props.history.push('/') }, 3000)
  //   return (
  //     <>
  //       <div> Hey! You're not supposed to be in here!! >:( </div>
  //     </>
  //   )
  // }

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

  // useEffect(() => {
  //   checkLogin()
  //   // if (!isLoggedIn) { setIsLoggedIn(false) }
  //   // checkLogin()
  // }, [isLoggedIn])

  if (isLoggedIn) {
    return (
      <>
        <div>Here is a protected test route, "{appUser}" -- You're only able to see this because you are logged in as "{appUser}"</div>
      </>
    )
  } else {
    // setTimeout(() => props.history.push('/'))
    return (
      <>
        <div>This is a protected route, you will be redirected now...</div>
      </>
    )
  }

}

export default withRouter(TestProtectedRoute)
