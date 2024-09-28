const express = require("express");
const authController = require("./../controllers/authController");
const commentController = require("./../controllers/commentController");
const router = express.Router({ mergeParams: true });
router.post("/", authController.protect, commentController.createComment);
router.post("/createreplay/:commentId", authController.protect, commentController.createReplay);
router.put('/:commentId', authController.protect, commentController.updateComment);
router.put('/:commentId/replays/:replayId', authController.protect, commentController.updateReplay);
router.get(
  "/get-comments-frompost/:postId",
  authController.protect,
  commentController.getCommentByPost
);
router.delete("/:commentId", authController.protect, commentController.deleteComment);
router.delete(
  "/:commentId/replays/:replayId",
  authController.protect,
  commentController.deleteReplay
);
router.post('/like/:commentId', authController.protect, commentController.createLikeComment);
router.post(
  "/dislike/:commentId",
  authController.protect,
  commentController.createDislikeComment
);
router.post(
  "/:commentId/replies/like/:replayId",
  authController.protect,
  commentController.createlikeReplay
);
router.post(
  "/:commentId/replies/dislike/:replayId",
  authController.protect,
  commentController.createdislikeReplay
);
module.exports = router;
