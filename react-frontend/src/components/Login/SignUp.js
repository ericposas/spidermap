import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import url from '../../url'
import axios from 'axios'
import validator from 'validator'
import { LAST_LOCATION } from '../../constants/constants'

const SignUp = ({ ...props }) => {

  const { history } = props

  const [username, setUsername] = useState('')

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [usernameValid, setUsernameValid] = useState(false)

  const [emailValid, setEmailValid] = useState(false)

  const [passwordValid, setPasswordValid] = useState(false)

  const [regModalVis, setRegModalVis] = useState(false)

  const [errorModalVis, setErrorModalVis] = useState(false)

  const [submitVis, setSubmitVis] = useState(true)

  const [submitted, setSubmitted] = useState(false)

  const registerUser = async e => {
    e.preventDefault()
    console.log('registering user')
    try {
      let result = await axios.post(`/auth/local/register`, {
        username: username,
        email: email,
        password: password
      })
      // if (result.data.user) console.log(result.data.user, result.data.jwt)
      // redirect upon successful register, else show a failed modal
      // console.log(result.data)
      if (result.data.user.confirmed == true) {
        setSubmitted(true)
        setSubmitVis(false)
        setRegModalVis(true)
        setTimeout(() => {
          setSubmitVis(true)
          dispatch({ type: LAST_LOCATION, payload: 'signup' })
          history.push('/')
        }, 2000)
      }
    } catch (e) {
      // console.log(e)
      console.log(e.message)
      setSubmitVis(false)
      setErrorModalVis(true)
      setTimeout(() => {
        setSubmitVis(true)
        setErrorModalVis(false)
      }, 2500)
    }
  }

  const checkUsernameInput = e => {
    let value = e.target.value
    setUsername(value)
    if (value.toString().trim().length) setUsernameValid(true)
    else setUsernameValid(false)
  }

  const checkEmailInput = e => {
    let value = e.target.value
    setEmail(value)
    if (validator.isEmail(value)) setEmailValid(true)
    else setEmailValid(false)
  }

  const checkPasswordInput = e => {
    let value = e.target.value
    setPassword(value)
    if (value.toString().trim().length) setPasswordValid(true)
    else setPasswordValid(false)
  }

  return (
    <>
      {
        regModalVis
        ? <><div className='modal-registered'>User has been registered, please login to continue</div></>
        : ''
      }
      {
        errorModalVis
        ? <><div className='modal-errored'>A user with the supplied credentials already exists or you have supplied invalid credentials</div></>
        : ''
      }
    {
      !submitted
      ? (<>
          <div>Register</div>
          <form>
            <input type='text' value={username} onChange={checkUsernameInput} placeholder='username'/><br/>
            { usernameValid ? '' : <><div className='warning-required'>required</div></> }
            <input type='text' value={email} onChange={checkEmailInput} placeholder='email'/><br/>
            { emailValid ? '' : <><div className='warning-required'>valid email required</div></> }
            <input type='password' value={password} onChange={checkPasswordInput} placeholder='password'/><br/>
            { passwordValid ? '' : <><div className='warning-required'>password required</div><br/></> }
            { submitVis ? <><input type='submit' value='submit' onClick={registerUser}/></> : '' }
          </form>
        </>) : ''
    }
    </>
  )

}

export default withRouter(SignUp)
