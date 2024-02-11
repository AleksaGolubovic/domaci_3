const mongoose = require('mongoose');
const commentSchema = require('./commentSchema');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  coordinates: {
    type: [Number],
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  photos: [String]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
