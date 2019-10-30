import React, { useEffect, useState, Fragment } from 'react'
import { checkAuth, getUser } from '../../localStore'
import url from '../../url'
import axios from 'axios'

const Dropdown = ({ ...props }) => {

  const [options, setOptions] = useState([])

  useEffect(() => {
    if (checkAuth()) {
      if (options.length == 0) {
        if (props.type == 'code') createOptionsFromCodes()
        else if (props.type == 'region') createOptionsFromRegions()
      }
    }
  }, [props.type])

  const createOptionsFromCodes = async () => {
    try {
      let result = await axios.get(`${url}/airports/byCode`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
      console.log(result)
      let resultArr = result.data.map(ap => {
        if (ap.code != null) return <Fragment key={ap.code}><option>{ap.code}</option></Fragment>
      })
      setOptions(resultArr)
    } catch (e) {
      console.log(e)
    }
  }

  const createOptionsFromRegions = async () => {
    try {
      let result = await axios.get(`${url}/airports/byCode`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
      console.log(result)
      // need to filter regions before mapping to react elts
      let regions = result.data.map(ap => {
        if (ap.region != null) return ap.region
      })
      let filteredRegions = regions.filter((r, i) => regions.indexOf(r) == i)
      let options = filteredRegions.map(region => <Fragment key={region}><option>{region}</option></Fragment>)
      setOptions(options)
    } catch (e) {
      console.log(e)
    }
  }

  const selectionHandler = e => {
    console.log('selected:', e.target.value)
  }

  return (
    <>
      <select onChange={selectionHandler}>
        {options}
      </select>
    </>
  )

}

export default Dropdown
