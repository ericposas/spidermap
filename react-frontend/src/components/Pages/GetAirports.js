import React, { useState, useEffect } from 'react'
import url from '../../url'
import axios from 'axios'
// import checkAuth from '../../checkAuth'
import { withRouter } from 'react-router'

const GetAirports = ({ ...props }) => {

  const [airports, setAirports] = useState(null)

  // const getJwt = async () => {
  //   try {
  //     let session = await axios.get(`${url}/getSession`)
  //     return session
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  const getAirports = async () => {
    try {
      // proper auth route options
      // let create = await axios.post(`${url}/airports/`, { code: 'DFW', fullname: 'Dallas / Ft. Worth', region: 'North America', city: 'Dallas', latitude: 0.0, longitude: 0.0 }, { headers: { 'Authorization': `Bearer ${getUser().jwt}` } })
      // let session = await checkAuth()
      // try {
        // retrieve jwt from the session
        let session = await axios.get(`${url}/getSession`)
        console.log(session)
        let result = await axios.get(`${url}/airports`, { headers: { 'Authorization': `Bearer ${session.jwt}` } })
        let airportsArr = result.data.map(ap => {
          if (ap.code) return (<><div>{ap.code}</div></>)
          else return (<><div>{ap.four_digit_code}</div></>)
        })
        setAirports(airportsArr)
        console.log(result.data.length)
      // } else {
        // console.log('user is not logged in')
        // setTimeout(() => props.history.push('/'), 2000)
      // }
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

export default withRouter(GetAirports)
