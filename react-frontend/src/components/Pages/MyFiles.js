import React, { Fragment, useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import LogoutButton from '../Buttons/LogoutButton'
import { getUser, checkAuth } from '../../sessionStore'

const MyFiles = ({ ...props }) => {

  const [data, setData] = useState([])

  useEffect(() => {
    if (checkAuth()) {
      axios.get(`/files/${getUser().user._id}`)
           .then(data => setData(data.data))
           .catch(err => console.log(err))
    } else {
      props.history.push('/')
    }
  }, [])

  return (
    <>
    <LogoutButton/>
    {
      data.map(datum => (
        <Fragment key={datum.csv._id}>
          <div>
            <a href={datum.csv.url}>{datum.csv.url}</a>
          </div>
        </Fragment>
      ))
    }
    </>
  )

}

export default withRouter(MyFiles)
