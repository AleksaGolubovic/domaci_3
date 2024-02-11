const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/addPost', postController.addPost);
router.get('/getPost/:id', postController.getPost);
router.get('/getAllPosts', postController.getAllPosts);
router.put('/updatePost/:id', postController.updatePost);
router.delete('/deletePost/:id', postController.deletePost);

router.get('/getAllCategories', postController.getAllCategories);
router.get('/getAllPostsByCategory/:category', postController.getAllPostsByCategory);

module.exports = router;
