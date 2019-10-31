import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  SET_ORIGIN,
  SET_ORIGIN_LOCATIONS,
  SET_DESTINATION_LOCATIONS } from '../../constants/constants'
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

  const selectedOrigins = useSelector(state => state.selectedOrigins)

  const selectedDestinations = useSelector(state => state.selectedDestinations)

  useEffect(() => {
    if (checkAuth()) {
      if (options.length == 0) {
        if (props.type == 'code') createOptionsFromCodes()
        else if (props.type == 'category') createOptionsFromCategory()
      }
    }
  }, [props.type])

  const createOptionsFromCodes = async () => {
    try {
      let result = await axios.get(`${url}/airports/byCode`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
      setData(result.data)
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

  const setSingleSelection = (value, outputType) => {
    data.forEach(obj => {
      if (obj.code == value) {
        if (outputType == 'origins') {
          if (_.some(selectedOrigins, obj) == false) {
            dispatch({ type: SET_ORIGIN_LOCATIONS, payload: obj })
          }
        }
        if (outputType == 'destinations') {
          if (_.some(selectedDestinations, obj) == false) {
            dispatch({ type: SET_DESTINATION_LOCATIONS, payload: obj })
          }
        }
        
      }
    })
  }

  const setCategorySelection = (value, outputType) => {
    let category = airportsPerCategory[value]
    category.forEach(obj => {
      if (obj.category == value) {
        if (outputType == 'origins') {
          if (_.some(selectedOrigins, obj) == false) {
            dispatch({ type: SET_ORIGIN_LOCATIONS, payload: obj })
          }
        }
        if (outputType == 'destinations') {
          if (_.some(selectedDestinations, obj) == false) {
            dispatch({ type: SET_DESTINATION_LOCATIONS, payload: obj })
          }
        }

      }
    })
  }

  const selectionHandler = e => {
    let value = e.target.value
    if (type == 'code') setSingleSelection(value, props.output)
    else if (type == 'category') setCategorySelection(value, props.output)
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
