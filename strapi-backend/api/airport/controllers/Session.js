'use strict';
const cookie = require('cookie')

/**
 * Read the documentation () to implement custom controller functions
 */

module.exports = {

  setCookie: async ctx => {
    if (ctx.request.body && ctx.request.body.user && ctx.request.body.jwt) {
      let jwt = ctx.request.body.jwt
      let user = ctx.request.body.user
      ctx.response.set(
        'Set-Cookie',
        `user=${user}; jwt=${jwt}; httpOnly=true; maxAge=${60 * 60 * 1};`
      )
    }
    console.log(ctx.response.header)
  },

  getCookie: async ctx => {
    console.log(ctx.response.header)
    // let user = cookie.parse(ctx.response.header.user)
    // let jwt =  cookie.parse(ctx.response.header.jwt)
    // ctx.send({ user: user, jwt: jwt })
  },

  getSession: async ctx => {
    console.log(ctx.session)
    if (ctx.session && ctx.session.user && ctx.session.jwt) {
      ctx.send({ user: ctx.session.user, jwt: ctx.session.jwt, sessionStatus: 'retrieved' })
    } else {
      ctx.send({ sessionStatus: 'none' })
    }
  },
  
  setSession: async ctx => {
    if (ctx.request.body && ctx.request.body.user && ctx.request.body.jwt) {
      ctx.session.jwt = ctx.request.body.jwt
      ctx.session.user = ctx.request.body.user
      ctx.send({ sessionStatus: 'saved' })
    } else {
      ctx.send({ sessionStatus: 'not set' })
    }
    console.log(ctx.session)
  },

  logout: async ctx => {
    if (ctx.session.jwt && ctx.session.user) {
      ctx.session.jwt = null
      ctx.session.user = null
      ctx.send({ sessionStatus: 'unset' })
    } else {
      ctx.send({ sessionStatus: 'logout called, not sure if session was unset' })
    }
    console.log(ctx.session)
  }

};
