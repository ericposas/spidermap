import React, { useState, useEffect, Fragment } from 'react'
import BackButton from '../Buttons/BackButton'
import DashboardButton from '../Buttons/DashboardButton'
import '../../images/american-airlines-new-logo-slash.svg'
import { getUser, checkAuth } from '../../sessionStore'

const UserLeftSidePanel = ({ ...props }) => {

  const panelWidth = 300
  const logoWidth = 600
  const blueStrip = { width:30 }

  return (
    <>
      <div className='col-med' style={{ boxShadow: '10px 0 15px -10px rgba(0,0,0,0.2)' }}>
        <div className='color-strip'
             style={{
               backgroundColor: '#37acf4',
               position: 'absolute',
               height: '100vh',
               width: blueStrip.width+'px'
             }}></div>
        <div style={{width:panelWidth}}>
          <img src='./img/american-airlines-new-logo-slash.svg'/>
          <div style={{
            width:logoWidth+'px',
            backgroundImage: 'url(./img/american-airlines-new-logo-slash.svg)',
            backgroundImageSize: logoWidth }}></div>
          <br/>
          <br/>
          <div style={{
            margin:'0 0 0 28%',
            fontSize:'1.5rem',
            color:'#777'}}>Welcome</div>
          <div style={{
            margin:'0 0 0 28%',
            color:'#37acf4'}}>{getUser().user.email}</div>
          <br/>
          <div style={{
            float: 'left',
            width: panelWidth + 'px' }}>
            <div style={{
              width: (panelWidth * .6) + 'px' }}>
              <DashboardButton/><br/>
              <BackButton/>
            </div>
          </div>
        </div>
      </div>
    </>
  )

}

export default UserLeftSidePanel
