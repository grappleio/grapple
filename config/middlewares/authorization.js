/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function(req, res, next) {
    if (req.isAuthenticated()) return next()
    if (req.method == 'GET') req.session.returnTo = req.originalUrl
    res.redirect('/login')
}

/*
 *  User authorization routing middleware
 */

exports.user = {
    hasAuthorization: function(req, res, next) {
        if (req.profile.id != req.user.id) {
            req.flash('info', 'You are not authorized')
            return res.redirect('/users/' + req.profile.id)
        }
        next()
    }
}

/*
 *  Article authorization routing middleware
 */

exports.article = {
    hasAuthorization: function(req, res, next) {
        if (req.article.user.id != req.user.id) {
            req.flash('info', 'You are not authorized')
            return res.redirect('/articles/' + req.article.id)
        }
        next()
    }
}

exports.item = {
    hasAuthorization: function(req, res, next) {
        if (req.item.user.id != req.user.id) {
            req.flash('info', 'You are not authorized')
            return res.redirect('/items/' + req.item.id)
        }
        next()
    }
}

exports.agenda = {
    hasAuthorization: function(req, res, next) {
        if (req.agenda.user.id != req.user.id) {
            req.flash('info', 'You are not authorized')
            return res.redirect('/agendas/' + req.agenda.id)
        }
        next()
    }
}

exports.dashboard = {
    hasAuthorization: function(req, res, next) {
        if (req.dashboard.user.id != req.dashboard.id) {
            req.flash('info', 'You are not authorized')
            return res.redirect('/' + req.dashboard.id)
        }
        next()
    }
}
exports.meeting = {
    hasAuthorization: function(req, res, next) {
        if (req.meeting.user.id != req.user.id) {
            req.flash('info', 'You are not authorized')
            return res.redirect('/meetings/' + req.meeting.id)
        }
        next()
    }
}

/**
 * Comment authorization routing middleware
 */

exports.comment = {
    hasAuthorization: function(req, res, next) {
        // if the current user is comment owner or article owner
        // give them authority to delete
        if (req.user.id === req.comment.user.id || req.user.id === req.article.user.id) {
            next()
        } else {
            req.flash('info', 'You are not authorized')
            res.redirect('/articles/' + req.article.id)
        }
    }
}