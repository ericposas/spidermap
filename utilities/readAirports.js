const fs = require('fs')
const csvReadableStream = require('csv-reader')
const inputStream = fs.createReadStream('./airports.dat', 'utf-8')
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()
let url
if (process.env.NODE_ENV == 'development') {
  url = `http://${process.env.DEV_IP}:${process.env.PORT}/airports`
} else {
  url = `http://${process.env.PROD_IP}/airports`
}
console.log(url)

const wait = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

const pushToDB = async row => {
  try {
    let result = await axios.post(url, {
      code: row.code,
      fullname: row.fullname,
      four_digit_code: row.four_digit_code,
      region: row.region,
      city: row.city,
      latitude: row.latitude,
      longitude: row.longitude
    })
    console.log(result)
  } catch (e) {
    console.log(e)
  }
}

const rows = []

const doAsync = async rows => {
  for (let i = 0; i < rows.length; i++) {
    console.log(i)
    try {
      // await wait()
      let row = rows[i]
      await pushToDB(row)
      console.log('success')
    } catch (e) {
      console.log(e)
    }
  }
}

inputStream
  .pipe(csvReadableStream({ parseNumbers: true, parseBoolean: true, trim: true }))
  .on('data', async row => {
    rowObj = {}
    rowObj.fullname = row[1]
    rowObj.city = row[2]
    rowObj.region = row[3]
    rowObj.code = row[4] != '\\N' ? row[4] : null
    rowObj.four_digit_code = row[5] != '\\N' ? row[5] : null
    rowObj.latitude = row[6]
    rowObj.longitude = row[7]
    // console.log(rowObj)
    rows.push(rowObj)
  })
  .on('end', data => {
    console.log('no more rows.')
    doAsync(rows)
  })
