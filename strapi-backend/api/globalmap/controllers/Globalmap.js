'use strict';

/**
 * Read the documentation () to implement custom controller functions
 */

module.exports = {

  findByUserId: async ctx => {
    let url = ctx.request.url
    let userid = url.substr('/globalmaps/'.length, url.length-1)
    console.log(userid)
    if (userid) {
      let results = await strapi.query('globalmap').find({ belongsto: userid, _limit: 1000 })
      console.log(results)
      ctx.send(results)
    }
  },

};
