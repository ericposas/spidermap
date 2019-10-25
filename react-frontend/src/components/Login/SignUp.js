import React, { useState, useEffect } from 'react'
import url from '../../url'
import axios from 'axios'

const SignUp = ({ ...props }) => {

  const [username, setUsername] = useState('')

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const registerUser = async e => {
    e.preventDefault()
    console.log('registering user')
    try {
      let result = await axios.post(`${url}/auth/local/register`, {
        username: username,
        email: email,
        password: password
      })
      if (result.data.user) console.log(result.data.user, result.data.jwt)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <div>Register</div>
      <form>
        <input type='text' value={username} onChange={e => setUsername(e.target.value)}/>
        <input type='text' value={email} onChange={e => setEmail(e.target.value)}/>
        <input type='text' value={password} onChange={e => setPassword(e.target.value)}/>
        <input type='submit' value='submit' onClick={registerUser}/>
      </form>
    </>
  )

}

export default SignUp
