const Conversation = require("./../models/ConversationModel");
const Message = require("../models/MessageModel");
const AppError = require("./../middlewares/AppError");
const catchAsync = require("./../middlewares/catchAsync");
exports.createMessage = catchAsync(async (req, res, next) => {
    const conversationId = req.params.conversationId;
    const userId = req.user._id;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return next(new AppError("Conversation not found", 404));
    const message = await Message.create({
      sender: userId,
      conversationId,
      ...req.body,
    });
    res.status(200).json({
      status: "success",
      data: {
        message,
      },
    });
  }); 
exports.getMessage = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const conversation = await Conversation.findById(req.params.conversationId);
    if(!conversation.participants.includes(userId))return next(new AppError("You are not a member of this chat.🖐️", 404));
    const message = await Message.find({
      conversationId: req.params.conversationId,
    });
    if (!message) return next(new AppError("Message not found", 404));
    res.status(200).json({
      status: "success",
      data: {
        message,
      },
    });
  
});
exports.deleteMessage = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) return next(new AppError("Conversation not found", 404));
    if (!conversation.participants.includes(userId)) return next(new AppError("You are not a member of this chat.���️", 404));
    await Message.deleteMany({
      conversationId: req.params.conversationId,
    });
    res.status(200).json({
      status: "success",
      message: "All messages deleted successfully",
    });
});; 
