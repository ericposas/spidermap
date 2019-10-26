'use strict';

/**
 * Read the documentation () to implement custom controller functions
 */

module.exports = {

  findByCode: async ctx => {
    let results = await strapi.query('airport').find({ _limit: 1000 })
    // console.log(results)
    ctx.send(results)
  }

}
