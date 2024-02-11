const Post = require('../models/postSchema');
const User = require('../models/userSchema');
const Comment = require('../models/commentSchema');
const mongoose = require('mongoose');

const postController = {
  addPost: async (req, res) => {
    try {
      console.log("data: ",req.body);
      const { user, category, description, coordinates, rating, comments, photos } = req.body;

      const newPost = new Post({
        user : user,             
        category : category,
        description : description,
        coordinates : coordinates,
        rating : rating,
        comments : comments,
        photos : photos
      });
      console.log(newPost);
      const savedPost = await newPost.save();
      
      await User.findByIdAndUpdate(user, { $push: { posts: savedPost._id } });
      res.status(201).json(savedPost);
    } catch (error) {
      console.error('Error adding post:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getPost: async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId).populate('user comments');
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      console.error('Error getting post:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.find().populate('user comments');
      res.json(posts);
    } catch (error) {
      console.error('Error getting posts:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updatePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const { category, description, coordinates, rating, comments, photos } = req.body;
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { category, description, coordinates, rating, comments, photos },
        { new: true }
      ).populate('user comments');
      if (!updatedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(updatedPost);
    } catch (error) {
      console.error('Error updating post:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deletePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const deletedPost = await Post.findByIdAndDelete(postId);
      if (!deletedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }
      await User.findByIdAndUpdate(deletedPost.user, { $pull: { posts: postId } });
      await Comment.deleteMany({ post: postId });
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const categories = await Post.distinct('category');
      res.json({ categories });
    } catch (error) {
      console.error('Error getting categories:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getAllPostsByCategory: async (req, res) => {
    try {
      const category = req.params.category;
      const posts = await Post.find({ category }).populate('user comments');
      res.json(posts);
    } catch (error) {
      console.error('Error getting posts by category:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = postController;
