import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SET_SELECTED_LOCATIONS } from '../../constants/constants'
import { checkAuth, getUser } from '../../localStore'
import url from '../../url'
import axios from 'axios'
import _ from 'lodash'

const Dropdown = ({ ...props }) => {

  const { type } = props

  const [data, setData] = useState([])

  const [options, setOptions] = useState([])

  const [selection, setSelection] = useState([])

  const [airportsPerCategory, setAirportsPerCategory] = useState({})

  const dispatch = useDispatch()

  const selectedLocations = useSelector(state => state.selectedLocations)

  useEffect(() => {
    if (checkAuth()) {
      if (options.length == 0) {
        if (props.type == 'code') createOptionsFromCodes()
        // else if (props.type == 'region') createOptionsFromRegions()
        else if (props.type == 'category') createOptionsFromCategory()
      }
    }
  }, [props.type])

  const createOptionsFromCodes = async () => {
    try {
      let result = await axios.get(`${url}/airports/byCode`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
      // console.log(result)
      setData(result.data)
      // console.log(data)
      let resultArr = result.data.map(ap => {
        if (ap.code != null) return <Fragment key={ap.code}><option>{ap.code}</option></Fragment>
      })
      setOptions(resultArr)
    } catch (e) {
      console.log(e)
    }
  }

  const createOptionsFromCategory = async () => {
    try {
      let apPerCategory = {}
      let result = await axios.get(`${url}/airports/byCode`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
      setData(result.data)
      // get category fields, then sort alphabetically
      let categories = result.data.map(ap => ap.category).sort((a,b) => {
        if (a < b) return -1
        if (a > b) return 1
        return 0
      })
      result.data.forEach(ap => {
        if (!apPerCategory[ap.category]) apPerCategory[ap.category] = []
        apPerCategory[ap.category].push(ap)
        // apPerCategory[ap.category].push({ code: ap.code, lat: ap.latitude, long: ap.longitude })
      })
      setAirportsPerCategory(apPerCategory) // setting default after data load
      // display categories in options dropdown
      let filteredCategories = categories.filter((c, i) => categories.indexOf(c) == i)
      let options = filteredCategories.map(item => <Fragment key={item}><option>{item}</option></Fragment>)
      setOptions(options)
    } catch (e) {
      console.log(e)
    }
  }

  const setSingleSelection = value => {
    data.forEach(obj => {
      if (obj.code == value) {
        if (_.some(selectedLocations, obj) == false) {
          dispatch({ type: SET_SELECTED_LOCATIONS, payload: obj })
        }
      }
    })
  }

  const setCategorySelection = value => {
    let category = airportsPerCategory[value]
    category.forEach(obj => {
      if (obj.category == value) {
        if (_.some(selectedLocations, obj) == false) {
          dispatch({ type: SET_SELECTED_LOCATIONS, payload: obj })
        }
      }
    })
  }

  const selectionHandler = e => {
    let value = e.target.value
    if (type == 'code') setSingleSelection(value)
    else if (type == 'category') setCategorySelection(value)
  }

  return (
    <>
      <select onChange={selectionHandler}>
        <option>select:</option>
        {options}
      </select>
    </>
  )

}

export default Dropdown
