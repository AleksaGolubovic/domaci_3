const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  numberOfPosts: {
    type: Number,
    default: 0,
    min: 0
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post' 
  }]
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;
