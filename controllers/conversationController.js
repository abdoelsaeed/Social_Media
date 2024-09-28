const Conversation = require("./../models/ConversationModel");
const Message = require("../models/MessageModel");
const AppError = require("./../middlewares/AppError");
const catchAsync = require("./../middlewares/catchAsync");
exports.createConversation = catchAsync(async (req, res, next) => {
    console.log(req.body);
    if (!req.body.firstUser || !req.body.secondUser)
      return next(new AppError("You must put firstUser and SecondUser", 400));
      if (req.body.firstUser === req.body.secondUser) {
        return next(
          new AppError("FirstUser and SecondUser cannot be the same", 400)
        );
      }
      const { firstUser, secondUser } = req.body;
    const conversation = await Conversation.create({
      participants: [firstUser, secondUser],
    });
    res.status(201).json({
      status: "success",
      data:  conversation,
    });
}); 
exports.getAllConversationOfUser = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
const conversations = await Conversation.find({
  participants: { $in: [userId] },
});
  res.status(200).json({
    status: "success",
    data:  conversations,
  })
});
exports.getOneConversationOfUser = catchAsync(async (req, res, next) => {
  const secondUser = req.params.secondUser;
  const userId = req.user._id;
  const conversation = await Conversation.findOne({
    participants: { $all: [userId, secondUser] },
  });
  if (!conversation) return next(new AppError("You don't have conversation with this User",404));
  res.status(200).json({
    status: "success",
    data:  conversation,
  })
});
exports.deleteConversation = catchAsync(async (req, res, next) => {
  const conversationId = req.params.id;
  const conversation = await Conversation.findById(conversationId);
  const userId = req.user._id;
  if (!conversation.participants.includes(userId)) return next(new AppError("You don't have conversation with this User",404));
    await Conversation.deleteOne({ _id: conversationId });
  await Message.deleteMany({ conversationId: conversationId });
  res.status(204).json({
    status: "success",
    data: null,
  });
});