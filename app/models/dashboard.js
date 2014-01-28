
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , utils = require('../../lib/utils')

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',')
}

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',')
}

/**
 * Item Schema
 */

var DashboardSchema = new Schema({
  title: {type : String, default : '', trim : true},
  desc: {type : String, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  tags: {type: [], get: getTags, set: setTags},
  createdAt  : {type : Date, default : Date.now}
})

/**
 * Validations
 */
DashboardSchema.path('title').required(true, 'Dashboard title cannot be blank');
DashboardSchema.path('desc').required(true, 'Description body cannot be blank');

/**
 * Pre-remove hook
 */

DashboardSchema.pre('remove', function (next) {
  
  next()
})

/**
 * Methods
 */

DashboardSchema.methods = {

  /**
   * Save item and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  uploadAndSave: function (images, cb) {
     this.save(cb)
  }

}

/**
 * Statics
 */

DashboardSchema.statics = {

  /**
   * Find Item by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email username')
      .populate('comments.user')
      .exec(cb)
  },

  /**
   * List item
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Dashboard', DashboardSchema)
