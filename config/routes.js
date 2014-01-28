/*!
 * Module dependencies.
 */

var async = require('async')

/**
 * Controllers
 */

var users = require('../app/controllers/users')
  , articles = require('../app/controllers/articles')
  , items = require('../app/controllers/items')
  , meetings = require('../app/controllers/meetings')
  , agendas = require('../app/controllers/agendas')
  , auth = require('./middlewares/authorization')
  , dashboard = require('../app/controllers/dashboard')


/**
 * Route middlewares
 */

var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization]
var commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization]
var itemAuth = [auth.requiresLogin, auth.item.hasAuthorization]
var meetingAuth = [auth.requiresLogin, auth.meeting.hasAuthorization]
var agendaAuth = [auth.requiresLogin, auth.agenda.hasAuthorization]
var dashboardAuth = [auth.requiresLogin, auth.dashboard.hasAuthorization]

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  // user routes
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session)
  app.get('/users/:userId', users.show)
 
  app.get('/auth/github',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.signin)
  app.get('/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.authCallback)
  
  app.get('/auth/google',
    passport.authenticate('google', {
      failureRedirect: '/login',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }), users.signin)
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login'
    }), users.authCallback)
  app.get('/auth/linkedin',
    passport.authenticate('linkedin', {
      failureRedirect: '/login',
      scope: [
        'r_emailaddress'
      ]
    }), users.signin)
  app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', {
      failureRedirect: '/login'
    }), users.authCallback)

  app.param('userId', users.user)

  // article routes
  app.param('articleId', articles.load)
  app.get('/articles', articles.index)
  app.get('/articles/new', auth.requiresLogin, articles.new)
  app.post('/articles', auth.requiresLogin, articles.create)
  app.get('/articles/:articleId', articles.show)
  app.get('/articles/:articleId/edit', articleAuth, articles.edit)
  app.put('/articles/:articleId', articleAuth, articles.update)
  app.del('/articles/:articleId', articleAuth, articles.destroy)
  
  // item routes
  app.param('itemId', items.load)
  app.get('/items', items.index)
  app.get('/items/new', auth.requiresLogin, items.new)
  app.post('/items', auth.requiresLogin, items.create)
  app.get('/items/:itemId', items.show)
  app.get('/items/:itemId/edit', itemAuth, items.edit)
  app.put('/items/:itemId', itemAuth, items.update)
  app.del('/items/:itemId', itemAuth, items.destroy)

  // meeting routes
  app.param('meetingId', meetings.load)
  app.get('/meetings', meetings.index)
  app.get('/meetings/new', auth.requiresLogin, meetings.new)
  app.post('/meetings', auth.requiresLogin, meetings.create)
  app.get('/meetings/:meetingId', meetings.show)
  app.get('/meetings/:meetingId/edit', meetingAuth, meetings.edit)
  app.put('/meetings/:meetingId', meetingAuth, meetings.update)
  app.del('/meetings/:meetingId', meetingAuth, meetings.destroy)

  // agenda routes
  app.param('agendaId', agendas.load)
  app.get('/agendas', agendas.index)
  app.get('/agendas/new', auth.requiresLogin, agendas.new)
  app.post('/agendas', auth.requiresLogin, agendas.create)
  app.get('/agendas/:agendaId', agendas.show)
  app.get('/agendas/:agendaId/edit', agendaAuth, agendas.edit)
  app.put('/agendas/:agendaId', agendaAuth, agendas.update)
  app.del('/agendas/:agendaId', agendaAuth, agendas.destroy)


  // home route
  app.get('/', dashboard.index)

  // comment routes
  var comments = require('../app/controllers/comments')
  app.param('commentId', comments.load)
  app.post('/agenda/:agendaId/comments', auth.requiresLogin, comments.create)
  app.get('/agenda/:agendaId/comments', auth.requiresLogin, comments.create)
  app.del('/agenda/:agendaId/comments/:commentId', commentAuth, comments.destroy)

  // tag routes
  var tags = require('../app/controllers/tags')
  app.get('/tags/:tag', tags.index)

}
