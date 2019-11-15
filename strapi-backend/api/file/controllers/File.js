'use strict';

const axios = require('axios')

/**
 * Read the documentation () to implement custom controller functions
 */

module.exports = {

  findByUserId: async ctx => {
    let url = ctx.request.url
    let userid = url.substr('/files/'.length, url.length-1)
    console.log(userid)
    if (userid) {
      let results = await strapi.query('file').find({ belongsto: userid, _limit: 1000 })
      console.log(results)
      ctx.send(results)
    }
  },

  processData_Pointmap: async ctx => {

    const parse = require('csv-parse')

    let dataUrl = ctx.request.body.url
    dataUrl = dataUrl.substr(
      dataUrl.indexOf('/uploads/'),
      dataUrl.length-1
    )

    const parseData = data => {
      return new Promise((resolve, reject) => {
        parse(data, { relax_column_count: true }, (err, out) => {
          if (!err) resolve(out)
          else reject(err)
        })
      })
    }

    try {
      let data = await axios.get(dataUrl)
      let parsedData = await parseData(data.data)
      ctx.send(parsedData)
    } catch (err) {
      console.log(err)
    }

  },

  processData_Spidermap: async ctx => {

    const parse = require('csv-parse')

    let dataUrl = ctx.request.body.url
    dataUrl = dataUrl.substr(
      dataUrl.indexOf('/uploads/'),
      dataUrl.length-1
    )

    const parseData = data => {
      return new Promise((resolve, reject) => {
        parse(data, { relax_column_count: true }, (err, out) => {
          if (!err) resolve(out)
          else reject(err)
        })
      })
    }

    try {
      let data = await axios.get(dataUrl)
      let parsedData = await parseData(data.data)
      ctx.send(parsedData)
    } catch (err) {
      console.log(err)
    }

  }

}
