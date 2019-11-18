import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  LAST_LOCATION
} from '../../constants/constants'
import './buttons.scss'

const DashboardButton = ({ ...props }) => {

  const dispatch = useDispatch()

  const lastLocation = useSelector(state => state.lastLocation)

  const btnHandler = () => {
    let path = props.history.location.pathname
    path = path.substr(1, path.length)
    dispatch({ type: LAST_LOCATION, payload: path })
    props.history.push('/dashboard')
  }

  return (
    <>
      <button className='button-plain button-dashboard'
              onClick={btnHandler}>Dashboard</button>
    </>
  )

}

export default withRouter(DashboardButton)
