import React, { useState, useEffect } from 'react'
import SignIn from './SignIn'
// import SignUp from './SignUp'

const LoginPage = ({ ...props }) => {

  const [user, setUser] = useState('')

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => handleLoginChange())

  const handleLogout = e => {
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
