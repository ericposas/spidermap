import React, { useState, useEffect } from 'react'
import url from '../../url'
import axios from 'axios'
import validator from 'validator'

const SignIn = ({ ...props }) => {

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [validEmail, setValidEmail] = useState(false)

  const [validPassword, setValidPassword] = useState(false)

  const setsessionStorageLogin = data => {
    const { triggerLoginChange } = props
    sessionStorage.setItem(process.env.APP_NAME, JSON.stringify({ data: data }))
    triggerLoginChange()
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      let result = await axios.post(`${url}/auth/local`, { identifier: email, password: password })
      let data = result.data
      if (data.jwt && data.user) {
        setsessionStorageLogin(data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleChangeEmail = e => {
    let value = e.target.value
    setEmail(value)
    if (validator.isEmail(value)) setValidEmail(true)
    else setValidEmail(false)
  }

  const handleChangePassword = e => {
    let value = e.target.value
    setPassword(value)
    if (value.toString().trim().length) setValidPassword(true)
    else setValidPassword(false)
  }

  return (
    <>
      <div>Please sign-in to continue</div>
      <form>
        <input type='text' name='email' value={email} onChange={handleChangeEmail} />
        { validEmail ? '' : <><div className='warning-required'>valid email required</div></> }
        <input type='password' name='password' value={password} onChange={handleChangePassword} />
        { validPassword ? '' : <><div className='warning-required'>required</div></> }
        <input type='submit' name='submit' value='submit' onClick={handleSubmit} />
      </form>
    </>
  )
}

export default SignIn
