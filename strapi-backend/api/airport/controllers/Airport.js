'use strict';
const cookie = require('cookie')

/**
 * Read the documentation () to implement custom controller functions
 */

module.exports = {

  cookie: async ctx => {
    // console.log(ctx.session)
    if (ctx.request.body && ctx.request.body.jwt) {
      let jwt = ctx.request.body.jwt
      ctx.response.set('Set-Cookie', cookie.serialize('jwt', String(jwt), {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 // 1 week
      }))
    }
    console.log(ctx.response.header)

  },

  session: async ctx => {

    console.log(ctx.request.body)
    // ctx.session.jwt

  }

};
