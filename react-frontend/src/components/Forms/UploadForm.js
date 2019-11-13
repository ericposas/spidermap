import React, { useRef, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import LogoutButton from '../Buttons/LogoutButton'
import { getUser, checkAuth } from '../../sessionStore'
import {
  SET_ALL_CODES
} from '../../constants/constants'

const UploadForm = ({ ...props }) => {

  useEffect(() => {
    axios.get(`/airports/byCode`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
         .then(data => {
           dispatch({ type: SET_ALL_CODES, payload: data.data })
         })
         .catch(err => console.log(err))
  }, [])

  const dispatch = useDispatch()

  const formRef = useRef()

  const options = useSelector(state => state.allCodesData)

  const processForPointmap = data => {
    let dataObj = {}
    data.forEach((arr, i) => {
      // dataObj[arr[0]] =[]
      let tmp = [], tmpObjArr = []
      arr.forEach((item, i) => {
        if (item != arr[0]) tmp.push(item)
      })
      tmp.forEach(item => {
        options.forEach(option => {
          // console.log(item.trim() == option.code)
          if (item.trim() == option.code) {
            tmpObjArr.push(option)
            // console.log(true, tmpObjArr)
          }
        })
      })
      dataObj[arr[0]] = tmpObjArr
    })

    console.log(dataObj)
    console.log(options)
  }

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
                  if (props.type == 'pointmap') {
                    axios.post('/files/processData_Pointmap', { url: url })
                         .then(data => {
                           console.log(data)
                           processForPointmap(data.data)
                         })
                         .catch(err => console.log(err))
                  } else if (props.type == 'spidermap') {
                    axios.post('/files/processData_Spidermap', { url: url })
                         .then(data => console.log(data))
                         .catch(err => console.log(err))
                  } else if (props.type == 'listview') {
                    axios.post('/files/processData_ListView', { url: url })
                         .then(data => console.log(data))
                         .catch(err => console.log(err))
                  } else {
                    console.log('no UploadForm type specified')
                  }
                })
                .catch(err => console.log(err))
         })
         .catch(err => console.log(err))
  }

  return (
    <>
      <div>Upload a CSV for locations</div>
      <form ref={formRef}>
        <input type='file' name='files' onChange={handleSubmit}/>
      </form>
    </>
  )

}

export default withRouter(UploadForm)
