import React, { useEffect, useState, Fragment } from 'react'
import { checkAuth, getUser } from '../../localStore'
import url from '../../url'
import axios from 'axios'
import _ from 'lodash'

// const airportsPerCategory = {}


const Dropdown = ({ ...props }) => {

  const { type } = props

  const [data, setData] = useState([])

  const [options, setOptions] = useState([])

  const [selection, setSelection] = useState([])

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
      let airportsPerCategory = {}
      let result = await axios.get(`${url}/airports/byCode`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
      setData(result.data)
      // get category fields, then sort alphabetically
      let categories = result.data.map(ap => ap.category).sort((a,b) => {
        if (a < b) return -1
        if (a > b) return 1
        return 0
      })
      result.data.forEach(ap => {
        if (!airportsPerCategory[ap.category]) airportsPerCategory[ap.category] = []
        airportsPerCategory[ap.category].push({ code: ap.code, lat: ap.latitude, long: ap.longitude })
      })
      // console.log(airportsPerCategory)
      // display categories in options dropdown
      let filteredCategories = categories.filter((c, i) => categories.indexOf(c) == i)
      let options = filteredCategories.map(item => <Fragment key={item}><option>{item}</option></Fragment>)
      setOptions(options)
    } catch (e) {
      console.log(e)
    }
  }

  // const createOptionsFromRegions = async () => {
  //   try {
  //     let result = await axios.get(`${url}/airports/byCode`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
  //     console.log(result)
  //     // need to filter regions before mapping to react elts
  //     let regions = result.data.map(ap => {
  //       if (ap.region != null) return ap.region
  //     })
  //     let filteredRegions = regions.filter((r, i) => regions.indexOf(r) == i)
  //     let options = filteredRegions.map(region => <Fragment key={region}><option>{region}</option></Fragment>)
  //     setOptions(options)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  const showSelections = () => {
    let arr = selection.map((item, i) => (
      <Fragment key={item.id}>
        <div>{item.id} {item.code} {item.region} {item.category}</div>
      </Fragment>
    ))
    return arr
  }

  const setSingleSelection = value => {
    data.forEach(obj => {
      if (obj.code == value) {
        // console.log(_.includes(selection, obj))
        if (_.includes(selection, obj) == false) setSelection(selection => selection.concat(obj))
      }
    })
  }

  const selectionHandler = e => {
    let value = e.target.value
    if (type == 'code') setSingleSelection(value)
    else if (type == 'category') {
      data.forEach(obj => {


      })
    }
  }

  return (
    <>
      <select onChange={selectionHandler}>
        {options}
      </select>
      <div>
        {
          selection
          ? showSelections()
          : ''
        }
      </div>
    </>
  )

}

export default Dropdown
