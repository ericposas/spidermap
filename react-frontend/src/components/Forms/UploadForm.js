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
import {
  SET_ORIGIN_SPIDERMAP,
  REMOVE_ORIGIN_SPIDERMAP,
  SET_DESTINATION_LOCATIONS_SPIDERMAP,
  REMOVE_ALL_DESTINATIONS_SPIDERMAP
} from '../../constants/spidermap'
import {
  SET_ORIGIN_LISTVIEW,
  REMOVE_ORIGIN_LISTVIEW,
  SET_DESTINATION_LOCATIONS_LISTVIEW,
  REMOVE_ALL_DESTINATIONS_LISTVIEW
} from '../../constants/listview'

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

  const [showIncorrectFormat, setShowIncorrectFormat] = useState()

  const processForPointmap = data => {
    // clear our list first, then process new CSV
    dispatch({ type: CLEAR_ORIGIN_LOCATIONS_POINTMAP })
    dispatch({ type: SET_DESTINATION_LOCATIONS_POINTMAP_AT_ONCE, payload: {} })

    let dataObj = {}
    let origins = []
    if (data[1]) {
      data.forEach((arr, i) => {
        let originCodes = []
        let tmp = [], tmpObjArr = []
        arr.forEach((item, i) => {
          if (item != arr[0]) tmp.push(item)
        })
        tmp.forEach(item => {
          options.forEach(option => {
            if (item.trim() == option.code && item.trim() != arr[0].trim()) {
              tmpObjArr.push(option)
            }
          })
        })
        originCodes.push(arr[0].trim())
        originCodes.forEach(origin => {
          options.forEach(option => {
            if (origin.trim() == option.code) {
              origins.push(option)
            }
          })
        })
        dataObj[arr[0].trim()] = tmpObjArr
      })
      dispatch({ type: SET_ORIGIN_LOCATIONS_POINTMAP, payload: origins })
      dispatch({ type: SET_DESTINATION_LOCATIONS_POINTMAP_AT_ONCE, payload: dataObj })

      console.log(
        'hide modal and any uploading graphics here..'
      )
      if (props.setModalVisibility) {
        props.setModalVisibility(false)
      }

    } else {
      console.log('incorrect csv format for point-to-point-map')
      setShowIncorrectFormat('pointmap')
      setTimeout(() => setShowIncorrectFormat(null), 2000)
    }

  }

  const processForSpidermap = data => {
    // clear list
    dispatch({ type: REMOVE_ORIGIN_SPIDERMAP })
    dispatch({ type: REMOVE_ALL_DESTINATIONS_SPIDERMAP })

    let origin
    let destinations = []
    if (data[1]) {
      console.log('incorrect csv format for spidermap')
      setShowIncorrectFormat('spidermap')
      setTimeout(() => setShowIncorrectFormat(null), 2000)
    } else {
      // process csv entries
      let _data = data[0].map(item => item.trim())
      _data = _data.filter((item, i) => _data.indexOf(_data[0]) != i)
      options.forEach(option => {
        _data.forEach(datum => {
          if (option.code == _data[0]) origin = option
          else if (option.code == datum) destinations.push(option)
        })
      })
      dispatch({ type: SET_ORIGIN_SPIDERMAP, payload: origin })
      dispatch({ type: SET_DESTINATION_LOCATIONS_SPIDERMAP, payload: { origin: origin, item: destinations.slice(0, destinations.length) } })

      console.log(
        'hide modal and any uploading graphics here..'
      )
      if (props.setModalVisibility) {
        props.setModalVisibility(false)
      }

    }

  }

  const processForListView = data => {
    // clear list
    dispatch({ type: REMOVE_ORIGIN_LISTVIEW })
    dispatch({ type: REMOVE_ALL_DESTINATIONS_LISTVIEW })

    let origin
    let destinations = []
    if (data[1]) {
      console.log('incorrect csv format for listview')
      setShowIncorrectFormat('listview')
      setTimeout(() => setShowIncorrectFormat(null), 2000)
    } else {
      // process csv entries
      let _data = data[0].map(item => item.trim())
      _data = _data.filter((item, i) => _data.indexOf(_data[0]) != i)
      options.forEach(option => {
        _data.forEach(datum => {
          if (option.code == _data[0]) origin = option
          else if (option.code == datum) destinations.push(option)
        })
      })
      dispatch({ type: SET_ORIGIN_LISTVIEW, payload: origin })
      dispatch({ type: SET_DESTINATION_LOCATIONS_LISTVIEW, payload: { origin: origin, item: destinations.slice(0, destinations.length) } })

      console.log(
        'hide modal and any uploading graphics here..'
      )
      if (props.setModalVisibility) {
        props.setModalVisibility(false)
      }

    }

  }

  const formRef = useRef()

  const [label, setLabel] = useState('')

  const handleLabelInput = e => {
    setLabel(e.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    // console.log(props)
    console.log(
      'show upload circle graphic on the modal/window...'
    )

    let formData = new FormData(formRef.current)

    axios.post('/files', { belongsto: getUser().user._id, label }, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
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
                    axios.post('/files/processData_Pointmap', { url: url }, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
                         .then(data => {
                           console.log(data)
                           processForPointmap(data.data)
                         })
                         .catch(err => console.log(err))
                  } else if (props.type == 'spidermap') {
                    axios.post('/files/processData_Spidermap', { url: url }, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
                         .then(data => {
                           console.log(data)
                           processForSpidermap(data.data)
                         })
                         .catch(err => console.log(err))
                  } else if (props.type == 'listview') {
                    axios.post('/files/processData_Spidermap', { url: url }, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
                         .then(data => {
                           console.log(data)
                           processForListView(data.data)
                         })
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
      <div style={{
          margin: '40px'
        }}>
        {
          props.type == 'spidermap' || props.type == 'listview'
          ?
            (<div className='hint-text'>
              Upload a CSV for all destinations <br/>
              (first airport code is designated as the origin airport)<br/>
              in the below example, DFW would be the origin, with all others being the destinations <br/>
              DFW, CLT, ORD, LAX, PHX <br/>
              <br/>
            </div>)
          :
            (<div className='hint-text'>
              Upload a CSV for all destinations <br/>
              (first airport code of each line in the .csv file is designated as the origin airport)<br/>
              e.g. below: <br/>
              DFW, LAX, JFK, PHX <br/>
              PHX, PHL, CLT, LGA <br/>
              (DFW and PHX would be designated as the origin airports, with the following airports in their respective lines being their destinations)<br/>
              <br/>
            </div>)
        }
        <br/>
        <form ref={formRef}>
          <span>File Label:</span><input type='text' value={label} onChange={handleLabelInput} onKeyPress={ e => { if (e.which == 13) e.preventDefault() }}/>
          <br/>
          <br/>
          {
            label != ''
            ?
              (<>
                <input type='file'
                       name='files'
                       onChange={handleSubmit}/>
              </>)
            : <div style={{color:'red',fontSize:'.8rem'}}>Please provide a label before choosing a .CSV file</div>
          }
          {
            showIncorrectFormat
            ?
              <div>
                <div className='modal-incorrect-csv-format'>Incorrect CSV file format for {showIncorrectFormat}</div>
              </div>
            : null
          }
        </form>
      </div>
    </>
  )

}

export default withRouter(UploadForm)
