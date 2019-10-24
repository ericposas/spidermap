import React, { useState, useEffect } from 'react'
import axios from 'axios'
import url from '../../url'

const SignIn = ({ ...props }) => {

  console.log(localStorage)

  // console.log(props)

  // let url // post url for auth

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  // const [jwt, setJwt] = useState(null)

  // const setSession = async data => {
  //   try {
  //     let result = await axios.post(`${url}/session`, { data: data })
  //     let auth = JSON.parse(result.config.data).data.user.role.type
  //     console.log(auth)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  const storeJwt = async data => {
    try {
      console.log(data, data.jwt)
      // let result = await axios.post(`${url}/jwts`, { data: { id: data.user.id, jwt: data.jwt } })
      // let headers = { 'Authorization': `Bearer ${data.jwt}` }
      // let result = await axios.post(`${url}/jwts`, { token: data.jwt }, { "headers": headers })

      let result = await axios.post(`${url}/jwts`, { userId: data.user.id, data: data }, {
        headers: {
          'Authorization': `Bearer ${data.jwt}`
        }
      })
      console.log(result)

    } catch (e) {
      console.log(e)
    }
  }

  const setLocalStorageLogin = user => {
    const { triggerLoginChange } = props
    localStorage.setItem('appUser', JSON.stringify({ user: user }))
    // console.log(localStorage)

    // we can then check against localStorage to see if the user has loggedIn w/o exposing the jwt token

    // to logout, we simply unset 'appUser' from localStorage

    // console.log(triggerLoginChange)
    triggerLoginChange()
  }

  const handleSubmit = async e => {
    e.preventDefault()
    // process.env.NODE_ENV == 'development' ? url = `http://${process.env.DEV_IP}` : url = `http://${process.env.PROD_IP}`
    try {
      let result = await axios.post(`${url}/auth/local`, { identifier: email, password: password })
      let data = result.data
      if (data.jwt && data.user) {
        // temp store jwt
        storeJwt(data) // store jwt in database for later retrieval
        // set strapi session
        // setSession(data)
        setLocalStorageLogin(data.user)
        // console.log(data.user)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleChangeEmail = e => setEmail(e.target.value)

  const handleChangePassword = e => setPassword(e.target.value)

  useEffect(() => {
    // console.log(email)
    // return () => console.log(`this is how we "clean" up the effect after the component "unmounts" which runs after each re-render`)
  })

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
