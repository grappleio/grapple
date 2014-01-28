/**
 * dashboard controller.
 */


/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Dashboard = mongoose.model('Dashboard'),
    utils = require('../../lib/utils'),
    extend = require('util')._extend

    /**
     * Load
     */

    exports.load = function(req, res, next, id) {
        var User = mongoose.model('User')

        Dashboard.load(id, function(err, dashboard) {
            if (err) return next(err)
            if (!dashboard) return next()
            req.dashboard = dashboard
            next()
        })
    }

    /**
     * List
     */

exports.index = function(req, res) {
    // var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
    // var perPage = 30
    // var options = {
    //   perPage: perPage,
    //   page: page
    // }

    /* Dashboard.list(options, function(err, agendas) {
    if (err) return res.render('500')
    Agenda.count().exec(function (err, count) {
      res.render('agendas/index', {
        title: 'Agendas',
        agendas: agendas,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
    })
  })*/
}

/**
 * New agenda
 */

exports.new = function(req, res) {
    res.render('dashboard/new', {
        title: 'New Dashboard',
        dashboard: new Dashboard({})
    })
}

/**
 * Create an agenda
 */

exports.create = function(req, res) {
    var dashboard = new Dashboard(req.body)
    dashboard.user = req.user

    dashboard.uploadAndSave(req.files.image, function(err) {
        if (!err) {
            req.flash('success', 'Successfully created dashboard!')
            return res.redirect('/dashboard/' + dashboard._id)
        }

        res.render('dashboards/new', {
            title: 'New dashboard',
            dashboard: dashboard,
            errors: utils.errors(err.errors || err)
        })
    })
}

/**
 * Edit an dashboard
 */

exports.edit = function(req, res) {
    res.render('agendas/edit', {
        title: 'Edit ' + req.dashboard.title,
        dashboard: req.dashboard
    })
}

/**
 * Update agenda
 */

exports.update = function(req, res) {
    var dashboard = req.dashboard
    dashboard = extend(dashboard, req.body)

    dashboard.uploadAndSave(req.files.image, function(err) {
        if (!err) {
            return res.redirect('/dashboards/' + dashboard._id)
        }

        res.render('dashboards/edit', {
            title: 'Edit Dashboard',
            dashboard: dashboard,
            errors: err.errors
        })
    })
}

/**
 * Show
 */

exports.show = function(req, res) {
    res.render('dashboards/show', {
        user: req.user
    })
}

/**
 * Delete an agenda
 */

exports.destroy = function(req, res) {
    var dashboard = req.dashboard
    dashboard.remove(function(err) {
        req.flash('info', 'Deleted successfully')
        res.redirect('/dashboards')
    })
}