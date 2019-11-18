// example post request
// curl -X POST http://localhost:1337/airports/ -d "fullname=Mount Kagamuga Airport&code=HGU&region=Papua New Guinea&latitude=-5.826789855957031&longitude=144.29600524902344"

const fs = require('fs')
const lineReader = require('line-reader')
// const readline = require('readline')
// const readInterface = readline.createInterface({
//   input: fs.createReadStream('./airports.dat'),
//   output: process.stdout,
//   console: false
// })
const wait = seconds => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, seconds * 1000)
  })
}
const logLine = async line => {
  try {
    await wait(2)

    console.log(line)
  } catch (e) {
    console.log(e)
  }
}

const postLine = async line => {
  try {
    let url
    if (process.env.MODE == 'development') {
      url = `http://${DEV_IP}:${PORT}/airports`
    } else {
      url = `http://${PROD_IP}/airports`
    }
    let postResult = await axios.post(url)
    console.log(postResult)
  } catch (e) {
    console.log(e)
  }
}

// push lines here and then process asynchronously
const lines = []

lineReader.eachLine('./airports.dat', async line => {
  try {
    // do something with the line
    // await logLine(line)
    // await postLine(line)
    // console.log(line)
    lines.push(line)
  } catch (e) {
    console.log(e)
  }
  console.log(lines)
})
