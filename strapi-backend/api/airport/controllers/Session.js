'use strict';
const cookie = require('cookie')

/**
 * Read the documentation () to implement custom controller functions
 */

module.exports = {

  cookie: async ctx => {
    if (ctx.request.body && ctx.request.body.jwt) {
      let jwt = ctx.request.body.jwt
      ctx.response.set('Set-Cookie', cookie.serialize('jwt', String(jwt), {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 // 1 week
      }))
    }
    console.log(ctx.response.header)

  },

  getSession: async ctx => {
    if (ctx.session && ctx.session.jwt) {
      ctx.send({ sessionStatus: 'retrieved' })
    }
  },

  setSession: async ctx => {
    if (ctx.request.body && ctx.request.body.jwt) {
      ctx.session.jwt = ctx.request.body.jwt
      ctx.send({ sessionStatus: 'saved' })
    }
  },

  logout: async ctx => {
    if (ctx.session.jwt) {
      ctx.session.jwt = null
      ctx.send({ sessionStatus: 'unset' })
    }
  }

};
