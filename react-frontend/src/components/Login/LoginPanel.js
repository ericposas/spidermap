import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SignUpPrompt from './SignUpPrompt'
import SignIn from './SignIn'
import { getUser, checkAuth } from '../../sessionStore'
import url from '../../url'
import axios from 'axios'
import '../../images/american-airlines-new-logo-slash.svg'
import { LAST_LOCATION } from '../../constants/constants'

const LoginPanel = ({ ...props }) => {

  const panelWidth = 300
  const logoWidth = 600
  const blueStrip = { width:30 }

  const { history } = props

  const [user, setUser] = useState('')

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [ifLoggedOut, setIfLoggedOut] = useState(false)

  const dispatch = useDispatch()

  const lastLocation = useSelector(state => state.lastLocation)

  useEffect(() => handleLoginChange(), [])

  const handleLoginChange = () => {
    // check user loggedIn
    let userData = JSON.parse(sessionStorage.getItem(process.env.APP_NAME))
    if (userData) {
      setIsLoggedIn(true)
      dispatch({ type: LAST_LOCATION, payload: 'login' })
      history.push('/dashboard')
    } else {
      // show user logged out if done so recently
      if (lastLocation) { setIfLoggedOut(true); setTimeout(() => setIfLoggedOut(false), 3000); }
      setIsLoggedIn(false)
    }
  }

  const handleSignUpClick = () => {
    history.push('/signUp')
    dispatch({ type: LAST_LOCATION, payload: 'login' })
  }

  return (
    <>
      <>
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
              Sign in
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
                ifLoggedOut
                ?
                  lastLocation == 'autologout'
                  ? (<>
                      <div className='modal-loggedout'>you have been logged out due to 15 min. of inactivity</div>
                     </>)
                  : (<>
                      <div className='modal-loggedout'>not logged in.</div>
                     </>)
                : ''
              }
              {
                !isLoggedIn
                ? (<>
                    <div
                      style={{
                        margin: '0 0 0 17.5%'
                      }}>
                      <SignIn triggerLoginChange={handleLoginChange}/>
                      <br/>
                      <SignUpPrompt signUpClickHandler={handleSignUpClick}/>
                    </div>
                  </>) : ''
              }
            </div>
          </div>
        </div>
      </>
    </>
  )

}

export default withRouter(LoginPanel)
