import React, { useState, useEffect, Fragment } from 'react'
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
        if (ap.code) return (<Fragment key={ap.code}><div>{ap.code}</div></Fragment>)
        else return (<Fragment key={ap.four_digit_code}><div>{ap.four_digit_code}</div></Fragment>)
      })
      setAirports(airportsArr)
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
