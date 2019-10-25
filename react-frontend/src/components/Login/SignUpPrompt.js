import React, { useState } from 'react'
import axios from 'axios'
import url from '../../url'

const SignUpPrompt = ({ ...props }) => {

  const { signUpClickHandler } = props

  const divs = (
    <>
      <div>Not signed up? Create a new account</div>
      <button onClick={signUpClickHandler}>Create account</button>
    </>
  )

  return (
    <>
      {divs}
    </>
  )

}

export default SignUpPrompt
