import React, { useState } from 'react'
import { Redirect, history } from 'react-router'
import { withRouter } from 'react-router-dom'
import checkAuth from '../../checkAuth'

let session

const TestProtectedRoute = ({ ...props }) => {

  const routeRedirect = () => {
    console.log('user is not authenticated!')
    setTimeout(() => { props.history.push('/') }, 3000)
    return (
      <>
        <div> Hey! You're not supposed to be in here!! >:( </div>
      </>
    )
  }

  useEffect(() => { session = checkAuth() }, [])

  if (session && session.sessionStatus == 'retrieved') {
    console.log('user is authenticated, you are free to continue.')
    return (
      <>
        <div>Here is a protected test route, "{user}" -- You're only able to see this because you are logged in as "{user}"</div>
      </>
    )
  } else {
    return routeRedirect()
  }

}

export default withRouter(TestProtectedRoute)
