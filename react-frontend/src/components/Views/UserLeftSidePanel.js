import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import BackButton from '../Buttons/BackButton'
import LogoutButton from '../Buttons/LogoutButton'
import DashboardButton from '../Buttons/DashboardButton'
// import '../../images/american-airlines-new-logo-slash.svg'
import '../../images/aa-logo-with-subtitle.png'
import { getUser, checkAuth } from '../../sessionStore'
import { LAST_LOCATION } from '../../constants/constants'
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
        <div style={{
            marginTop: '100px',
            width:panelWidth
          }}>
          <img
            onClick={() => {
              dispatch({ type: CLEAR_SELECTED_MENU_ITEM })
              props.history.push('/dashboard')
            }}
            src='./img/aa-logo-with-subtitle.png'
            style={{
              width: '220px', margin: '0 20px 0 25px',
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
          <div
            className='logout-text-button'
            onClick={
              () => {
                sessionStorage.removeItem(process.env.APP_NAME)
                let path = props.history.location.pathname
                path = path.substr(1, path.length)
                dispatch({ type: LAST_LOCATION, payload: path })
                props.history.push('/')
            }}
            style={{
              color: '#777', textAlign: 'center',
              cursor: 'pointer', fontSize: '.85rem'
            }}>Log out</div>
          <br/>
          <div style={{
              position: 'relative',
              marginTop: '40px'
            }}>
            <div style={{
                width: '70%',
                position: 'absolute',
                margin: 'auto',
                left: 0, right: 0
              }}>
              <DashboardButton/>
              <div style={{ paddingBottom: '10px' }}></div>
              <BackButton/>
            </div>
            <br/>
            <br/>
            {/*<div style={{
                position: 'absolute',
                bottom: 0, width: '200px'
              }}>
              <LogoutButton/>
            </div>*/}
          </div>
        </div>
      </div>
    </>
  )

}

export default withRouter(UserLeftSidePanel)
