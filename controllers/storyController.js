const AppError = require("./../middlewares/AppError");
const catchAsync = require("./../middlewares/catchAsync");
const Story = require("./../models/StoryModel");
const User = require('./../models/UserModel');
exports.createSttory = catchAsync(async (req, res, next) => {
    let image = '';
    const userId = req.user._id;
    if(req.file){
        image = process.env.URL+`uploads/${req.file.filename}`;
    }
    const story = await Story.create({...req.body,user:userId,image:image});
    res.status(201).json({
        status:'success',
        data:story
    });
});
exports.getAllStories = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const followingUser = user.following;
    if(followingUser.length ===0)return next(
      new AppError("YOU do not have following Therefore Not viewed", 404)
    );
    const stories = await Story.find({ user: { $ne: followingUser } }).populate(
      "user",
      "fullName",
      "username",
      "profilePicture"
    );
    res.status(200).json({
        status:'success',
        data:stories
    });
});
exports.deleteStory = catchAsync(async (req, res, next) => {
    const story = await Story.findById(req.params.storyId);
    if(!story) return next(new AppError("Story not found", 404));
    const userId = req.user._id;
    if(story.user.toString()!== userId.toString()) return next(new AppError("You are not owner of this story", 404));
    await story.deleteOne()
    res.status(204).json({
        status:'success',
        message:'Story deleted successfully'
    });
});
exports.deleteStories = catchAsync(async (req, res, next) => {
    const stories = await Story.find({ user: req.user._id });
    if(stories.length ===0) return next(
      new AppError("You have not any story therefore not deleted", 404)
    );
    await Story.deleteMany({ user: req.user._id });
    res.status(204).json({
        status:'success',
        message:'Stories deleted successfully'
    });
});