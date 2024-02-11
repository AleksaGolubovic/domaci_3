const mongoose = require('mongoose');
const Post = require('../models/postSchema');
const Comment = require('../models/commentSchema');
const User = require('../models/userSchema');
const { post } = require('../routes/userRoutes');

const commentController = {
  addCommentToPost: async (req, res) => {
    console.log("data: ", req.body);
    try {
      console.log("data req.body: ",req.body);
      const { post, user, text } = req.body.newComment;
      console.log("data user: ",user);
      console.log("data text: ",text);
      //const parsedPostId = mongoose.Types.ObjectId(postId); //ne znam za ovo il ne valja il treba svuda ovako , todo: test

      const newComment = new Comment({
        post: post,
        user: user,
        text: text
      });
      console.log("data: newComent",newComment);
      const savedComment = await newComment.save();

      //await Post.findByIdAndUpdate(postId, { $push: { comments: savedComment._id } }, { new: true });
      await User.findByIdAndUpdate(user, { $push: { posts: savedComment._id } });
      res.status(201).json(savedComment);
    } catch (error) {
      console.error('Error adding comment to post:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  addReplyToComment: async (req, res) => {
    try {
      const { post, commentId, user, text } = req.body;

      const parsedCommentId = mongoose.Types.ObjectId(commentId);

      const newReply = new Comment({
        post,
        user,
        text,
        replies: []
      });

      const savedReply = await newReply.save();

      await Comment.findByIdAndUpdate(parsedCommentId, { $push: { replies: savedReply._id } });

      res.status(201).json(savedReply);
    } catch (error) {
      console.error('Error adding reply to comment:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const { commentId } = req.params;

      const parsedCommentId = mongoose.Types.ObjectId(commentId);

      const comment = await Comment.findById(parsedCommentId);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      const postId = comment.post; 

      await Post.findByIdAndUpdate(postId, { $pull: { comments: parsedCommentId } });

      await Comment.findByIdAndDelete(parsedCommentId);

      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getAllComments: async (req, res) => {
    try {
      console.log(req.params);
      const { postId } = req.params; // Assuming postId is passed in the URL parameters

      console.log('post id: ',postId);
  
      const allComments = await Comment.find({ post: postId }).populate('user');
  
      console.log('all comments: ',allComments);
      res.status(200).json(allComments);
    } catch (error) {
      console.error('Error getting comments for a specific post:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = commentController;
