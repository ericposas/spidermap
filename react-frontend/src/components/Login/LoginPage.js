import React, { useState, useEffect } from 'react'
import SignIn from './SignIn'
import url from '../../url'
import axios from 'axios'
// import checkAuth from '../../checkAuth'
// import SignUp from './SignUp'

const LoginPage = ({ ...props }) => {

  const [user, setUser] = useState('')

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    handleLoginChange()
  }, [])

  const handleLogout = async e => {
    // localStorage.removeItem('appUser')
    let request = await axios.post(`${url}/logout`)
    console.log(request)
    handleLoginChange()
  }

  const handleLoginChange = async () => {
    // check user loggedIn
    // let userData = JSON.parse(localStorage.getItem('appUser'))
    try {
      let session = await axios.get(`${url}/getSession`)
      console.log(session)
      if (session) {
        setIsLoggedIn(true)
        setUser(session.user.username)
      } else {
        setIsLoggedIn(false)
        setUser('')
      }
    } catch (e) {
      console.log(e)
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
