const passport = require('passport');
const User = require('../models/userSchema');
const Post = require('../models/postSchema');

const userController = {
  addUser: async (req, res) => {
    try {
      const { username } = req.body;
      const newUser = new User({
        username,
        posts: []
      });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);                                  
    } catch (error) {
      console.error('Error adding user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const populatedUser = await User.populate(user, { path: 'posts', model: 'Post' });

      res.json(populatedUser);
    } catch (error) {
      console.error('Error getting user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();

      const populatedUsers = await User.populate(users, { path: 'posts', model: 'Post' });

      res.json(populatedUsers);
    } catch (error) {
      console.error('Error getting users:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const { username, posts } = req.body;

      const existingPosts = await Post.find({ _id: { $in: posts } });
      if (existingPosts.length !== posts.length) {
        return res.status(400).json({ error: 'Invalid post IDs' });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username, posts },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;

      await Post.deleteMany({ user: userId });

      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getUserPosts: async (req, res) => {
    try {
      const userId = req.params.id;

      const userPosts = await Post.find({ user: userId });

      res.json(userPosts);
    } catch (error) {
      console.error('Error getting user posts:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getUserComments: async (req, res) => {
    try {
      const userId = req.params.id;

      const userComments = await Comment.find({ user: userId });

      res.json(userComments);
    } catch (error) {
      console.error('Error getting user comments:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  registerUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      const newUser = new User({ username });

      await User.register(newUser, password);

     
      res.redirect('/'); 
    } catch (error) {
      console.error('Error registering user:', error.message);
      
      res.redirect('/register'); 
    }
  },

  loginUser: (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
       
       return res.redirect('/login'); 
      }
      if (!user) {
        
        return res.redirect('/login'); 
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.redirect('/login'); 
         
        }
        
        res.redirect('/'); 
      });
    })(req, res, next);
  },

logoutUser: (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    
    res.json({ message: 'Logout successful' });
  });
},

currentUser: (req, res) => {
  res.json(req.isAuthenticated() ? req.user : null);
}
};

module.exports = userController;
