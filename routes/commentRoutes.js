const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/addCommentToPost', commentController.addCommentToPost);
router.post('/addReplyToComment', commentController.addReplyToComment);
router.delete('/deleteComment/:commentId', commentController.deleteComment);
router.get('/getAllComments/:postId', commentController.getAllComments);

module.exports = router;
