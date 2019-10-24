import React, { useState, useEffect } from 'react'
import SignIn from './SignIn'
import { getUser, checkAuth } from '../../checkAuth'
import url from '../../url'
import axios from 'axios'
// import SignUp from './SignUp'

const LoginPage = ({ ...props }) => {

  const [user, setUser] = useState('')

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => handleLoginChange())

  // const getJwt = async () => {
  //   try {
  //
  //     if (checkAuth()) {
  //       let id = getUser().id
  //       let result = await axios.get(`${url}/jwts/getByUserId`, { userId: id })
  //       console.log(result)
  //       return result
  //     }
  //
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }
  //
  // const deleteJwtEntry = async data => {
  //   try {
  //     console.log(data, data.jwt)
  //     let result = await axios.delete(`${url}/jwts/deleteByUserId`, {}, {
  //       headers: {
  //         'Authorization': `Bearer ${data.jwt}`
  //       }
  //     })
  //     console.log(result)
  //
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  const handleLogout = e => {
    // let data = getJwt()
    // deleteJwtEntry(data)
    localStorage.removeItem('appUser')
    handleLoginChange()
  }

  const handleLoginChange = () => {
    // check user loggedIn
    let loggedInUser = JSON.parse(localStorage.getItem('appUser'))
    // console.log(localStorage.getItem('appUser'))
    if (loggedInUser) {
      // console.log(loggedInUser.user.username)
      setIsLoggedIn(true)
      setUser(loggedInUser.user.username)
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
