import React, { useState, useEffect } from 'react'
import url from '../../url'
import axios from 'axios'
import validator from 'validator'
import '../Buttons/buttons.scss'

const SignIn = ({ ...props }) => {

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [validEmail, setValidEmail] = useState(false)

  const [validPassword, setValidPassword] = useState(false)

  const [successModalVis, setSuccessModalVis] = useState(false)

  const [failModalVis, setFailModalVis] = useState(false)

  const [submitVis, setSubmitVis] = useState(true)

  const setSessionStorageLogin = data => {
    const { triggerLoginChange } = props
    sessionStorage.setItem(process.env.APP_NAME, JSON.stringify({ data: data }))
    setSubmitVis(false)
    setTimeout(() => {
      setSubmitVis(true)
      setSuccessModalVis(false)
      triggerLoginChange()
    }, 2000)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      let result = await axios.post(`/auth/local`, { identifier: email, password: password })
      let data = result.data
      if (data.jwt && data.user) {
        setEmail('')
        setPassword('')
        setSessionStorageLogin(data)
        setSuccessModalVis(true)
      }
    } catch (e) {
      console.log(e)
      setEmail('')
      setPassword('')
      setFailModalVis(true)
      setSubmitVis(false)
      setTimeout(() => {
        setSubmitVis(true)
        setFailModalVis(false)
      }, 1500)
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
      { successModalVis ? <><div className='modal-success' style={{ margin: '0 0 0 -17.5%' }}>Sign-in successful!</div></> : '' }
      { failModalVis ? <><div className='modal-errored' style={{ margin: '0 0 0 -17.5%' }}>Sign-in failed.</div></> : '' }
      <div style={{ fontSize: '.9rem' }}>Please sign-in to continue</div>
      <form>
        <input type='text' name='email' value={email} onChange={handleChangeEmail} placeholder='email address'/><br/>
        { validEmail ? '' : <><div className='warning-required'>valid email required</div></> }
        <input type='password' name='password' value={password} onChange={handleChangePassword} placeholder='password'/><br/>
        { validPassword ? '' : <><div className='warning-required'>required</div></> }
        { submitVis ? <input className='button-default' type='submit' name='submit' value='Sign in' onClick={handleSubmit} /> : '' }
      </form>
    </>
  )
}

export default SignIn
