import React, { useState } from 'react'
import axios from 'axios'
import url from '../../url'
import '../Buttons/buttons.scss'

const SignUpPrompt = ({ ...props }) => {

  const { signUpClickHandler } = props

  const divs = (
    <>
      <br/>
      <div style={{ fontSize: '.85rem' }}>Not signed up?</div>
      <button className='button-plain' onClick={signUpClickHandler}>Create account</button>
      <br/>
      <br/>
    </>
  )

  return (
    <>
      {divs}
    </>
  )

}

export default SignUpPrompt
