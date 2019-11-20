import React from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { LAST_LOCATION } from '../../constants/constants'
import { CLEAR_SELECTED_MENU_ITEM } from '../../constants/menu'
import './buttons.scss'

const BackButton = ({ ...props }) => {

  const dispatch = useDispatch()

  const lastLocation = useSelector(state => state.lastLocation)

  const backButtonHandler = () => {
    let path = props.history.location.pathname
    path = path.substr(1, path.length)
    dispatch({ type: CLEAR_SELECTED_MENU_ITEM })
    if (path != `${lastLocation}`) {
      dispatch({ type: LAST_LOCATION, payload: path })
      props.history.push(`/${lastLocation}`)
    }
  }
  
  return (
    <>
      <button className='button-plain button-back'
              onClick={backButtonHandler}>Back</button>
    </>
  )

}

export default withRouter(BackButton)
