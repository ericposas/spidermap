import React, { useEffect, useState } from 'react'

const Dashboard = ({ ...props }) => {

  const { logoutHandler, user } = props




  return (
    <>
      <div>Welcome {user}</div>
      <button style={{float:'right'}} onClick={logoutHandler}>logout</button>
    </>
  )

}

export default Dashboard
