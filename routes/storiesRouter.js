const express = require("express");
const authController = require("./../controllers/authController");
const StoryController = require("./../controllers/storyController");
const upload = require("./../middlewares/upload");
const router = express.Router();
router.post("/", authController.protect, upload.single('image'),StoryController.createSttory);

router.get("/", authController.protect, StoryController.getAllStories);
router.delete('/:storyId', authController.protect, StoryController.deleteStory)
module.exports = router;
