import React, { useRef, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import LogoutButton from '../Buttons/LogoutButton'
import { getUser, checkAuth } from '../../sessionStore'

const Upload = ({ ...props }) => {

  const formRef = useRef()

  const handleSubmit = e => {
    e.preventDefault()

    let formData = new FormData(formRef.current)

    axios.post('/files', { belongsto: getUser().user._id })
         .then(data => {
           formData.append('ref', 'File')
           formData.append('refId', data.data._id)
           formData.append('field', 'csv')
           axios.post('/upload', formData, { headers: { 'Content-type': 'multipart/form-data' } })
                .then(data => {
                  let url = data.data[0].url
                  console.log(
                    url.substr(url.indexOf('/uploads'), url.length-1)
                  )
                })
                .catch(err => console.log(err))
         })
         .catch(err => console.log(err))

  }

  return (
    <>
      <LogoutButton/>
      <form ref={formRef}>
        <input type='file' name='files' onChange={handleSubmit}/>
      </form>
    </>
  )

}

export default withRouter(Upload)
