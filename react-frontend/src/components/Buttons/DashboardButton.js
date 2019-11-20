import React from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { LAST_LOCATION } from '../../constants/constants'
import { CLEAR_SELECTED_MENU_ITEM } from '../../constants/menu'
import './buttons.scss'

const DashboardButton = ({ ...props }) => {

  const dispatch = useDispatch()

  const lastLocation = useSelector(state => state.lastLocation)

  const btnHandler = () => {
    let path = props.history.location.pathname
    path = path.substr(1, path.length)
    dispatch({ type: CLEAR_SELECTED_MENU_ITEM })
    if (path != 'dashboard') {
      dispatch({ type: LAST_LOCATION, payload: 'dashboard' })
      props.history.push('/dashboard')
    }
  }

  return (
    <>
      <button className='button-plain button-dashboard'
              onClick={btnHandler}>Dashboard</button>
    </>
  )

}

export default withRouter(DashboardButton)
