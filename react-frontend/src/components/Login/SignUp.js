import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import url from '../../url'
import axios from 'axios'
import validator from 'validator'
import { LAST_LOCATION } from '../../constants/constants'
import '../Buttons/buttons.scss'

const SignUp = ({ ...props }) => {

  const panelWidth = 300
  const logoWidth = 600
  const blueStrip = { width:30 }

  const { history } = props

  const dispatch = useDispatch()

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
        password: password,
        isadmin: false,
      })
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

  return (<>
      <div className='col-med' style={{
          width:'300px',
          height:'100vh',
          backgroundColor: 'white',
        }}>
          <div className='color-strip'
               style={{
                 backgroundColor: '#37acf4',
                 position: 'absolute',
                 height: '100vh',
                 width: blueStrip.width+'px'
               }}>
          </div>
          <div style={{width:panelWidth}}>
            <img src='./img/american-airlines-new-logo-slash.svg'/>
            <div style={{
              width:logoWidth+'px',
              backgroundImage: 'url(./img/american-airlines-new-logo-slash.svg)',
              backgroundImageSize: logoWidth }}>
            </div>
            <br/>
            <br/>
            <div style={{
                fontWeight: 'lighter',
                textAlign: 'center',
                fontSize:'1.5rem',
                color:'#777'
              }}>
              Sign Up
              <div
                onClick={ () => history.push('/login') }
                style={{
                  color:'#37ACF4',
                  fontSize: '.85rem',
                  cursor: 'pointer',
                }}>
                  &lt; Back to Signin &#63;
              </div>
            </div>
            <div style={{
                fontWeight: 'lighter',
                textAlign: 'center',
                color:'#37acf4'
              }}>
            </div>
            <br/>
            <div>
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
            </div>
            {
              !submitted
              ? (<div
                  style={{
                    margin: '0 0 0 17.5%'
                  }}>
                  <div>Register</div>
                  <form>
                    <input type='text' value={username} onChange={checkUsernameInput} placeholder='username'/><br/>
                    { usernameValid ? '' : <><div className='warning-required'>required</div></> }
                    <input type='text' value={email} onChange={checkEmailInput} placeholder='email'/><br/>
                    { emailValid ? '' : <><div className='warning-required'>valid email required</div></> }
                    <input type='password' value={password} onChange={checkPasswordInput} placeholder='password'/><br/>
                    { passwordValid ? '' : <><div className='warning-required'>password required</div><br/></> }
                    { submitVis ? <><input className='button-plain' type='submit' value='submit' onClick={registerUser}/></> : '' }
                  </form>
                </div>)
              : ''
            }
          </div>
        </div>
  </>)

}

export default withRouter(SignUp)
