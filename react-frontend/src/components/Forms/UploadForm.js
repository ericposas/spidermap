import React, { useRef, useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import LogoutButton from '../Buttons/LogoutButton'
import { getUser, checkAuth } from '../../sessionStore'
import {
  SET_ALL_CODES
} from '../../constants/constants'
import {
  SET_DESTINATION_LOCATIONS_POINTMAP_AT_ONCE,
  SET_ORIGIN_LOCATIONS_POINTMAP,
  CLEAR_ORIGIN_LOCATIONS_POINTMAP
} from '../../constants/pointmap'

const UploadForm = ({ ...props }) => {

  useEffect(() => {
    axios.get(`/airports/byCode`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
         .then(data => {
           dispatch({ type: SET_ALL_CODES, payload: data.data })
         })
         .catch(err => console.log(err))
  }, [])

  const dispatch = useDispatch()

  const options = useSelector(state => state.allCodesData)

  const processForPointmap = data => {
    // clear our list first, then process new CSV
    dispatch({ type: CLEAR_ORIGIN_LOCATIONS_POINTMAP })
    dispatch({ type: SET_DESTINATION_LOCATIONS_POINTMAP_AT_ONCE, payload: {} })
    
    let dataObj = {}
    let origins = []
    data.forEach((arr, i) => {
      let originCodes = []
      let tmp = [], tmpObjArr = []
      arr.forEach((item, i) => {
        if (item != arr[0]) tmp.push(item)
      })
      tmp.forEach(item => {
        options.forEach(option => {
          if (item.trim() == option.code) {
            tmpObjArr.push(option)
          }
        })
      })
      originCodes.push(arr[0])
      originCodes.forEach(origin => {
        options.forEach(option => {
          if (origin.trim() == option.code) {
            origins.push(option)
          }
        })
      })
      dataObj[arr[0]] = tmpObjArr
    })

    dispatch({ type: SET_ORIGIN_LOCATIONS_POINTMAP, payload: origins })
    dispatch({ type: SET_DESTINATION_LOCATIONS_POINTMAP_AT_ONCE, payload: dataObj })
  }

  const formRef = useRef()

  const [label, setLabel] = useState('')

  const handleLabelInput = e => {
    setLabel(e.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault()

    let formData = new FormData(formRef.current)

    axios.post('/files', { belongsto: getUser().user._id, label })
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
        <span>File Label:</span><input type='text' value={label} onChange={handleLabelInput}/>
        <br/>
        {
          label != ''
          ?
           (<>
             <input type='file' name='files' onChange={handleSubmit}/>
           </>)
          : <div style={{color:'red',fontSize:'.8rem'}}>Please provide a label before choosing a .CSV file</div>
        }
      </form>
    </>
  )

}

export default withRouter(UploadForm)
