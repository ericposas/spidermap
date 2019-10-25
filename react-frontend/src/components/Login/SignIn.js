import React, { useState, useEffect } from 'react'
import url from '../../url'
import axios from 'axios'

const SignIn = ({ ...props }) => {

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const setLocalStorageLogin = data => {
    const { triggerLoginChange } = props
    localStorage.setItem(process.env.APP_NAME, JSON.stringify({ data: data }))
    triggerLoginChange()
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      let result = await axios.post(`${url}/auth/local`, { identifier: email, password: password })
      let data = result.data
      if (data.jwt && data.user) {
        setLocalStorageLogin(data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleChangeEmail = e => setEmail(e.target.value)

  const handleChangePassword = e => setPassword(e.target.value)

  return (
    <>
      <div>Please sign-in to continue</div>
      <form>
        <input type='text' name='email' value={email} onChange={handleChangeEmail} />
        <input type='text' name='password' value={password} onChange={handleChangePassword} />
        <input type='submit' name='submit' value='submit' onClick={handleSubmit} />
      </form>
    </>
  )
}

export default SignIn
