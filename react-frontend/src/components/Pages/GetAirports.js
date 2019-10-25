import React, { useState, useEffect } from 'react'
import { getUser } from '../../localStore'
import url from '../../url'
import axios from 'axios'

const GetAirports = ({ ...props }) => {

  const [airports, setAirports] = useState(null)

  const getAirports = async () => {
    try {
      // proper auth route options 
      // let create = await axios.post(`${url}/airports/`, { code: 'DFW', fullname: 'Dallas / Ft. Worth', region: 'North America', city: 'Dallas', latitude: 0.0, longitude: 0.0 }, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
      let result = await axios.get(`${url}/airports`, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
      let airportsArr = result.data.map(ap => {
        if (ap.code) return (<><div>{ap.code}</div></>)
        else return (<><div>{ap.four_digit_code}</div></>)
      })
      setAirports(airportsArr)
      console.log(result.data.length)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => { getAirports() }, [])

  return (
    <>
      <div>{airports}</div>
    </>
  )

}

export default GetAirports
