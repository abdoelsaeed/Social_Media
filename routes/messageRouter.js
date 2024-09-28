const express = require("express");
const authController = require("./../controllers/authController");
const messsageController = require("./../controllers/messageController");
const router = express.Router();
router.post(
  "/conversationId/:conversationId",
  authController.protect,
  messsageController.createMessage
);
router.get(
  "/conversationId/:conversationId",
  authController.protect,
  messsageController.getMessage
);
router.delete("/conversationId/:conversationId",authController.protect,
  messsageController.deleteMessage
);
module.exports = router;
