import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import BackButton from '../Buttons/BackButton'
import LogoutButton from '../Buttons/LogoutButton'
import DashboardButton from '../Buttons/DashboardButton'
// import '../../images/american-airlines-new-logo-slash.svg'
import '../../images/aa-logo-with-subtitle.png'
import { getUser, checkAuth } from '../../sessionStore'
import { CLEAR_SELECTED_MENU_ITEM } from '../../constants/menu'

const UserLeftSidePanel = ({ ...props }) => {

  const panelWidth = 250
  const logoWidth = 600
  const blueStrip = { width:30 }

  const dispatch = useDispatch()

  return (
    <>
    <div className='col-med' style={{
        width:'250px', height:'100vh',
        margin: '0 0 0 15px', backgroundColor: '#fff',
      }}>
        <div className='color-strip'
             style={{
               height: '100vh', position: 'absolute',
               backgroundColor: '#37acf4', width: blueStrip.width+'px'
             }}>
        </div>
        <div style={{width:panelWidth}}>
          <img
            onClick={() => {
              dispatch({ type: CLEAR_SELECTED_MENU_ITEM })
              props.history.push('/dashboard')
            }}
            src='./img/aa-logo-with-subtitle.png'
            style={{
              width: '250px', margin: '0 20px 0 10px',
              cursor: 'pointer'
            }} />
          <br/><br/>
          <div style={{
              fontWeight: 'lighter', textAlign: 'center',
              fontSize:'1.5rem', color:'#777'
            }}>
            Welcome
          </div>
          <div style={{
              fontWeight: 'lighter', textAlign: 'center',
              color:'#37acf4'
            }}>
            {
              checkAuth()
              ? (<><span onClick={() => console.log(getUser().user)}>{getUser().user.email}</span></>)
              : null
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

export default withRouter(UserLeftSidePanel)
