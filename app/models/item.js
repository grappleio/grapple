/*globals require,process */
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  env = process.env.NODE_ENV || 'development',
  config = require('../../config/config')[env],
  Schema = mongoose.Schema,
  utils = require('../../lib/utils');

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',');
};

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',');
};

/**
 * Item Schema
 */

var ItemSchema = new Schema({
  title: {type : String, default : '', trim : true},
  desc: {type : String, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  comments: [{
    body: { type : String, default : '' },
    user: { type : Schema.ObjectId, ref : 'User' },
    createdAt: { type : Date, default : Date.now }
  }],
  votePositionOne:{type: String, default : 'Approve', trim : true},
  votePositionTwo: {type: String, default : 'Disapprove', trim : true},
  votePositionThree: {type: String, default : 'Abstain' },
  tags: {type: [], get: getTags, set: setTags},
  createdAt  : {type : Date, default : Date.now}
});

/**
 * Validations
 */
ItemSchema.path('title').required(true, 'Item title cannot be blank');
ItemSchema.path('desc').required(true, 'Description cannot be blank');

/**
 * Pre-remove hook
 */

ItemSchema.pre('remove', function (next) {
  
  next();
});

/**
 * Methods
 */

ItemSchema.methods = {

  /**
   * Save item and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  uploadAndSave: function (images, cb) {
     this.save(cb);
  },

  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */

  addComment: function (user, comment, cb) {

    this.comments.push({
      body: comment.body,
      user: user._id
    });

    this.save(cb);
  },

  /**
   * Remove comment
   *
   * @param {commentId} String
   * @param {Function} cb
   * @api private
   */

  removeComment: function (commentId, cb) {
    var index = utils.indexof(this.comments, { id: commentId });

    if (~index) this.comments.splice(index, 1)
    else return cb('not found')
    this.save(cb);
  }
};

/**
 * Statics
 */

ItemSchema.statics = {

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
      .exec(cb);
  },

  /**
   * List item
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {};

    this.find(criteria)
      .populate('user', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }

};

mongoose.model('Item', ItemSchema);
