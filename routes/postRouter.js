const express = require("express");
const postController = require("./../controllers/postController");
const authController = require("./../controllers/authController");
const commentRouter = require('./commentRouter');
const upload = require("./../middlewares/upload");
const router = express.Router();
router.post("/", authController.protect, upload.array('images',5),postController.createPost);
router.patch("/:id", authController.protect, postController.updatePost);
router.get('/:id', authController.protect, postController.getAllposts);
router.delete('/:id', authController.protect, postController.deletePost);
router.post('/like/:postId', authController.protect, postController.createLike);
router.post(
  "/dislike/:postId",
  authController.protect,
  postController.dislikePost
);
router.use('/:postId/comments',commentRouter);
module.exports = router;
