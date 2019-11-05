import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  SET_DESTINATION_LOCATIONS_LISTVIEW
} from '../../constants/listview'
import {
  SET_ORIGIN_LOCATIONS_POINTMAP,
  SET_DESTINATION_LOCATIONS_POINTMAP,
} from '../../constants/pointmap'
import {
  SET_ORIGIN_SPIDERMAP,
  SET_DESTINATION_LOCATIONS_SPIDERMAP,
} from '../../constants/spidermap'
import { checkAuth, getUser } from '../../sessionStore'
import url from '../../url'
import axios from 'axios'
import _ from 'lodash'

// const url = 'http://127.0.0.1'

const Dropdown = ({ ...props }) => {

  const { type } = props

  const [data, setData] = useState([])

  const [options, setOptions] = useState([])

  const [selection, setSelection] = useState([])

  const [airportsPerCategory, setAirportsPerCategory] = useState({})

  const [values, setValues] = useState([])

  const dispatch = useDispatch()

  const selectedOriginSpidermap = useSelector(state => state.selectedOriginSpidermap)

  const selectedOriginsPointmap = useSelector(state => state.selectedOriginsPointmap)

  const selectedDestinationsSpidermap = useSelector(state => state.selectedDestinationsSpidermap)

  const selectedDestinationsPointmap = useSelector(state => state.selectedDestinationsPointmap)

  const selectedDestinationsListView = useSelector(state => state.selectedDestinationsListView)

  const currentlySelectedOriginPointmap = useSelector(state => state.currentlySelectedOriginPointmap)

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
      console.log(url)
      let result = await axios.get(`${url}/airports/byCode`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
      // let result = await axios.get(`${url}/airports/byCode`)
      setData(result.data)
      let resultArr = result.data.map(ap => {
        if (ap.code != null) {
          return (<Fragment key={ap.code}>
                    <option>{ap.code}</option>
                  </Fragment>)
        }
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

  const dispatchProperOutputType = (item, value, property, outputType) => {
    if (item[property] == value) {
      if (outputType == 'spidermap-origin') {
        dispatch({ type: SET_ORIGIN_SPIDERMAP, payload: item })
      }
      if (outputType == 'pointmap-origins') {
        if (_.some(selectedOriginsPointmap, item) == false) {
          dispatch({ type: SET_ORIGIN_LOCATIONS_POINTMAP, payload: item })
        }
      }
      if (outputType == 'spidermap-destinations') {
        if (_.some(selectedDestinationsSpidermap, item) == false) {
          dispatch({ type: SET_DESTINATION_LOCATIONS_SPIDERMAP, payload: { origin: selectedOriginSpidermap, item } })
        }
      }
      if (outputType == 'pointmap-destinations') {
        if (currentlySelectedOriginPointmap && selectedDestinationsPointmap) {
          if (_.some(selectedDestinationsPointmap[currentlySelectedOriginPointmap], item) == false) {
            dispatch({ type: SET_DESTINATION_LOCATIONS_POINTMAP, payload: { origin: currentlySelectedOriginPointmap, item } })
          }
        }
      }
      if (outputType == 'listview-destinations') {
        if (_.some(selectedDestinationsListView, item) == false) {
          dispatch({ type: SET_DESTINATION_LOCATIONS_LISTVIEW, payload: item })
        }
      }
    }
  }

  const setSingleSelection = (value, outputType) => {
    data.forEach(item => {
      dispatchProperOutputType(item, value, 'code', outputType)
    })
  }

  const setCategorySelection = (value, outputType) => {
    let category = airportsPerCategory[value]
    category.forEach(item => {
      dispatchProperOutputType(item, value, 'category', outputType)
    })
  }

  const setOptionsValues = e => {
    let { selectedOptions } = e.target
    selectedOptions = [].slice.call(selectedOptions)
    selectedOptions = selectedOptions.map(val => val.innerHTML)
    setValues(selectedOptions)
  }

  const selectionHandlerSingleOrigin = e => {
    if (type == 'code') {
      setSingleSelection(e.target.value, props.output)
    }
  }

  const selectionHandler = () => {
    if (type == 'code') {
      values.forEach(val => {
        setSingleSelection(val, props.output)
      })
    }
    else if (type == 'category') {
      values.forEach(val => {
        setCategorySelection(val, props.output)
      })
    }
  }

  return (
    <>
     {
       props.output != 'spidermap-origin'
       ?
         (<select style={{ margin: '0 0 0 20px'}}
                  onChange={ setOptionsValues }
                  multiple={ 'multiple' }>
            <option></option>
            {options}
          </select>)
       :
         (<select value={ selectedOriginSpidermap ? selectedOriginSpidermap.code : '' }
                  style={{ margin: '0 0 0 20px'}}
                  onChange={ selectionHandlerSingleOrigin }
                  multiple={ false }>
            <option></option>
            {options}
          </select>)

      }
      {
        props.output != 'spidermap-origin'
        ? <button onClick={selectionHandler}>Ok</button>
        : null
      }
    </>
  )

}

export default Dropdown
