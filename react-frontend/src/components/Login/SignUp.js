import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import url from '../../url'
import axios from 'axios'
import validator from 'validator'

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

  const registerUser = async e => {
    e.preventDefault()
    console.log('registering user')
    try {
      let result = await axios.post(`${url}/auth/local/register`, {
        username: username,
        email: email,
        password: password
      })
      // if (result.data.user) console.log(result.data.user, result.data.jwt)
      // redirect upon successful register, else show a failed modal
      // console.log(result.data)
      if (result.data.user.confirmed == true) {
        setRegModalVis(true)
        setTimeout(() => { history.push('/') }, 2000)
      }
    } catch (e) {
      // console.log(e)
      console.log(e.message)
      setErrorModalVis(true)
      setTimeout(() => { setErrorModalVis(false) }, 2500)
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
      <div>Register</div>
      <form>
        <input type='text' value={username} onChange={checkUsernameInput}/>
        { usernameValid ? '' : <><div>required</div></> }
        <input type='text' value={email} onChange={checkEmailInput}/>
        { emailValid ? '' : <><div>valid email required</div></> }
        <input type='password' value={password} onChange={checkPasswordInput}/>
        <input type='submit' value='submit' onClick={registerUser}/>
        { passwordValid ? '' : <><div>password required</div></> }
      </form>
    </>
  )

}

export default withRouter(SignUp)
