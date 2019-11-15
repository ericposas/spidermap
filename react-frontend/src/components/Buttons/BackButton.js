import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  LAST_LOCATION
} from '../../constants/constants'

const BackButton = ({ ...props }) => {

  const dispatch = useDispatch()

  const lastLocation = useSelector(state => state.lastLocation)

  const backButtonHandler = () => {
    let path = props.history.location.pathname
    path = path.substr(1, path.length)
    dispatch({ type: LAST_LOCATION, payload: path })
    props.history.push(`/${lastLocation}`)
  }

  return (
    <>
      <button style={{margin:'2px',float:'left'}}
              className='button-plain'
              onClick={backButtonHandler}>Back</button>
    </>
  )

}

export default withRouter(BackButton)
