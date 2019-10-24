import React, { useState } from 'react'
import { Redirect, history } from 'react-router'
import { withRouter } from 'react-router-dom'
import { getUser, checkAuth } from '../../checkAuth'

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

  if (checkAuth()) {
    return (
      <>
        <div>Here is a protected test route, "{getUser().user.username}" -- You're only able to see this because you are logged in as "{getUser().user.username}"</div>
      </>
    )
  } else {
    return routeRedirect()
  }

  // const routeRedirect = () => {
  //   setTimeout(() => {
  //     props.history.push('/')
  //   }, 3000)
  //   return (
  //     <>
  //       <div> Hey! You're not supposed to be in here!! >:( </div>
  //       {/* <Redirect exact to='/'/> */}
  //     </>
  //   )
  // }

  // const redirect = () => {
  //   setTimeout(() => {
  //     props.history.push('/')
  //   }, 3000)
  // }

  // if (localStorage.getItem('appUser')) {
  //   let appUser = JSON.parse(localStorage.getItem('appUser'))
  //   // console.log(appUser.user.confirmed, appUser.user.role.type)
  //   if (appUser && appUser.user.confirmed == true && appUser.user.role.type == 'authenticated') {
  //     return (
  //       <>
  //         <div>Here is a protected test route, "{appUser.user.username}" -- You're only able to see this because you are logged in as "{appUser.user.username}"</div>
  //       </>
  //     )
  //   } else {
  //     return routeRedirect()
  //   }
  // } else {
  //   return routeRedirect()
  // }

}

export default withRouter(TestProtectedRoute)
