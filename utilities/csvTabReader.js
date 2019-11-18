const fs = require('fs')
const parse = require('csv-parse')
require('dotenv').config()
const axios = require('axios')
const endpoint = `http://127.0.0.1:1337/airports`

const parseData = data => {
  return new Promise((resolve, reject) => {
    parse(data, { relax_column_count: true, delimiter: '\t' }, (err, out) => {
      if (!err) resolve(out)
      else reject(err)
    })
  })
}

const insertIntoDB = async data => {
  let _object = {}
  console.log(data.length)
  for (let i = 0; i < data.length; i++) {
    try {
      let insert = await axios.post(endpoint, {
        code: data[i][2],
        fullname: data[i][0],
        icao: data[i][3],
        region: data[i][1],
        city: data[i][data[i].length-1],
        latitude: data[i][4],
        longitude: data[i][5],
        category: data[i][1]
      })
      console.log(`successful insert for ${data[i][2]}`)
    } catch (err) {
      console.error(err)
    }
  }

}

const readData = async fileData => {
  try {
    let data = await parseData(fileData)
    await insertIntoDB(data)
    console.log('success')
  } catch (e) {
    console.log(e)
  }
}

let file = fs.readFile('SpiderMapData.txt', (err, data) => {
  if (!err) readData(data.toString())
})
