'use strict';
const cookie = require('cookie')

/**
 * Read the documentation () to implement custom controller functions
 */

module.exports = {

  cookie: async ctx => {
    console.log(ctx.session)

    ctx.response.set('Set-Cookie', cookie.serialize('beep', String('boop'), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    }))
    console.log(ctx.response.header)

  },

  session: async ctx => {

    console.log(ctx.body)
    // ctx.session.jwt

  }

};
