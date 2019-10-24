'use strict';

/**
 * Read the documentation () to implement custom controller functions
 */

module.exports = {

  session: async ctx => {
    console.log(this.session)
    ctx.send({})
  }

}
