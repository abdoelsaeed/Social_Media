const express = require("express");

const router = express.Router();
const upload = require('./../middlewares/upload')
const {
  getUser,
  updateUser,
  followUser,
  unFollowUser,
  blockUser,
  unblockUser,
  getBlockLest,
  deleteUser,
  searchUser,
  uploadProfilePicture,
  uploadCoverPicture,
} = require("./../controllers/userController");
const authController = require("./../controllers/authController");
router.post("/", authController.signup);
router.get("/logout", authController.protect,authController.logout);
router.post("/login", authController.login);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.post("/follow/:id",authController.protect, followUser);
router.post("/unfollow/:id", authController.protect, unFollowUser);
router.post("/block/:id", authController.protect, blockUser);
router.post("/unblock/:id", authController.protect, unblockUser);
router.get("/blocklist/:id", authController.protect, getBlockLest);
router.delete("/delete/:id", authController.protect, deleteUser);
router.get("/search/:query", authController.protect, searchUser);
router.put(
  "/update-profile-picture/:userId",
  authController.protect,
  upload.single("profilePicture"),
  uploadProfilePicture
);
router.put(
  "/update-cover-picture/:userId",
  authController.protect,
  upload.single("coverPicture"),
  uploadCoverPicture
);
module.exports = router;

