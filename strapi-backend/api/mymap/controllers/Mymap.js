'use strict';

/**
 * Read the documentation () to implement custom controller functions
 */

// const mongoose = require('mongoose')

module.exports = {

  // findById: async ctx => {
  //   let url = ctx.request.url
  //   let id = url.substr('/mymaps/'.length, url.length-1)
  //   console.log(id)
  //   if (id) {
  //     let result = await strapi.query('mymap').find({ _id: mongoose.Types.ObjectId(id) })
  //     console.log(result)
  //     ctx.send(result)
  //   }
  //
  // },

  findByMapName: async ctx => {
    let url = ctx.request.url
    let mapName = url.substr('/mymaps/'.length, url.length-1)
    console.log(mapName)
    if (mapName) {
      let results = await strapi.query('mymap').find({ name: mapName })
      console.log(results)
      ctx.send(results)
    }
  },

  findByUserId: async ctx => {
    let url = ctx.request.url
    let userid = url.substr('/mymaps/'.length, url.length-1)
    console.log(userid)
    if (userid) {
      let results = await strapi.query('mymap').find({ belongsto: userid, _limit: 1000 })
      console.log(results)
      ctx.send(results)
    }
  },

};
