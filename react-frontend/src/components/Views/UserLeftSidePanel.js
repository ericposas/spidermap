import React, { useState, useEffect, Fragment } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import BackButton from '../Buttons/BackButton'
import LogoutButton from '../Buttons/LogoutButton'
import DashboardButton from '../Buttons/DashboardButton'
import '../../images/american-airlines-new-logo-slash.svg'
import { getUser, checkAuth } from '../../sessionStore'

const UserLeftSidePanel = ({ ...props }) => {

  const panelWidth = 300
  const logoWidth = 600
  const blueStrip = { width:30 }

  return (
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
            Welcome
          </div>
          <div style={{
              fontWeight: 'lighter',
              textAlign: 'center',
              color:'#37acf4'
            }}>
            {
              getUser().user.email
            }
          </div>
          <br/>
          <div>
            <DashboardButton/><br/>
            <BackButton/><br/>
            <br/>
            <br/>
            <LogoutButton/>
          </div>
        </div>
      </div>
    </>
  )

}

export default UserLeftSidePanel
