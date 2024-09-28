const express = require("express");
const authController = require("./../controllers/authController");
const ConversationController = require("./../controllers/conversationController");
const router = express.Router();
router.post("/", authController.protect, ConversationController.createConversation);
router.get(
  "/",
  authController.protect,
  ConversationController.getAllConversationOfUser
);
router.get(
  "/seconduser/:secondUser",
  authController.protect,
  ConversationController.getOneConversationOfUser
);
router.delete('/:id', authController.protect, ConversationController.deleteConversation)
module.exports = router;
