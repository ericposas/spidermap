import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'

const Dashboard = ({ ...props }) => {

  const { logoutHandler, user, history } = props

  const airportsPageButtonHandler = () => history.push('/getAirports')

  return (
    <>
      <div>Welcome {user}</div>
      <div>See airports list</div>
      <button className='button-plain' onClick={airportsPageButtonHandler}>Airports</button>
      <button className='button-logout' onClick={logoutHandler}>logout</button>
    </>
  )

}

export default withRouter(Dashboard)
