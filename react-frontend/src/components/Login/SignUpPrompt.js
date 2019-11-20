import React, { useState } from 'react'
import axios from 'axios'
import url from '../../url'
import '../Buttons/buttons.scss'

const SignUpPrompt = ({ ...props }) => {

  const { signUpClickHandler } = props

  const divs = (
    <>
      <br/>
      <div>Not signed up? <br/>Create a new account</div>
      <button className='button-plain' onClick={signUpClickHandler}>Create account</button>
    </>
  )

  return (
    <>
      {divs}
    </>
  )

}

export default SignUpPrompt
