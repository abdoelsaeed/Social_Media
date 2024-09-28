const User = require('./../models/UserModel');
const AppError = require('./../middlewares/AppError');
const catchAsync = require('./../middlewares/catchAsync');
const Post = require('./../models/PostModel');
const Comment = require('./../models/CommentModel') 
const Story = require('./../models/StoryModel');
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) return next(new AppError("User not found", 404));
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

exports.followUser = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user._id);
  const userWantToFollow = await User.findById(req.params.id);
  if(!userWantToFollow||!currentUser) return next(new AppError("user not found", 404));
  if (req.user._id === req.params.id) return next(new AppError("Can't followed yourself bro😂", 404));
  if(currentUser.following.includes(req.params.id)) return next(new AppError("User already following", 400));

  currentUser.following.push(req.params.id);
  userWantToFollow.followers.push(req.user._id);
  await currentUser.save({ validateBeforeSave: false });
  await userWantToFollow.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "User followed successfully",
  });
});

exports.unFollowUser = catchAsync(async (req, res, next) => {
  
  const currentUser = await User.findById(req.user._id);
  const userWantToUnfollow = await User.findById(req.params.id);
  
  if (req.user._id === req.params.id) return next(new AppError("Can't unfollowed yourself bro😂", 404));
  if (!userWantToUnfollow || !currentUser) return next(new AppError("User not found", 404));
  if(!currentUser.following.includes(req.params.id)) return next(new AppError("User not following", 400));

  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== req.params.id
  );
  userWantToUnfollow.followers = userWantToUnfollow.followers.filter(
    (id) => id.toString() !== req.user._id.toString()
  );
  await userWantToUnfollow.save({ validateBeforeSave: false });
  await currentUser.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      message: "User UnFollowed successfully",
    });
});
exports.blockUser = catchAsync(async (req, res, next) => {
    const currentUser = await User.findById(req.user._id);
    const userWantToBlock = await User.findById(req.params.id);
    if (req.user._id === req.params.id) return next(new AppError("Can't block yourself bro😂", 404));
    if (!userWantToBlock || !currentUser) return next(new AppError("User not found", 404));
    if(currentUser.blockList.includes(req.params.id)) return next(new AppError("You are block this user",404));
    currentUser.blockList.push(req.params.id);
    currentUser.following = currentUser.following.filter((id)=>id.toString()!==req.params.id);
    userWantToBlock.followers = currentUser.followers.filter(
      (id) => id.toString() !== req.user._id
    );;
    await currentUser.save({ validateBeforeSave: false });
    await userWantToBlock.save({ validateBeforeSave: false });
    console.log(currentUser.blockList);
        res.status(200).json({
          status: "success",
          message: "User Blocked successfully",
        });
});
exports.unblockUser = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user._id);
  const userWantToBlock = await User.findById(req.params.id);
  if (req.user._id === req.params.id)
    return next(new AppError("Can't block yourself bro😂", 404));
  if (!userWantToBlock || !currentUser)
    return next(new AppError("User not found", 404));
  if (!currentUser.blockList.includes(req.params.id))
    return next(new AppError("You are not blocked this user", 404));
  currentUser.blockList = currentUser.blockList.filter(
    (id) => id.toString()!== req.params.id
  );
  await currentUser.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "User UnBlocked successfully",
  });
});
exports.getBlockLest = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate({path:'blockList',select:'username fullname profilePicture -_id'});
  if(!user) return next(new AppError("User not found", 404));
  const { blockList,...data } = user;
  console.log(data, blockList);
    res.status(200).json({
      status: "success",
      data: blockList,
    });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;;
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError("User not found", 404));
  await Post.deleteMany({user:req.params.id});
  await Comment.deleteMany({user:req.params.id});
  await Story.deleteMany({ user: userId });

  //دي يعني هاخد كل الفولوينج لليوزر وبعد كدا اشيلهم من الفلورز للمستخدمين الاخرين
  await User.updateMany(
    { _id: { $in: user.following } },
    { $pull: { followers: userId } }
  );
  await User.updateMany(
    { _id: { $in: user.followers } },
    { $pull: { following: userId } }
  );
  await Post.updateMany({},{$pull:{likes: userId}});
  await Comment.updateMany({}, { $pull: { likes: userId } });
  await Comment.updateMany({}, { $pull: { "replies.likes": userId } });

  res.status(204).json({
    status: "success",
    message: "User deleted successfully",
  });
});
exports.searchUser = catchAsync(async (req, res, next) => {
  const {query} = req.params;
  const users = await User.find({
    $or: [{ username: { $regex: new RegExp(query,'i') } },
      { fullname: { $regex: new RegExp(query,'i') } },
    ],
  });
  
    res.status(201).json({
      status: "success",
      results: users.length,
      data: users,
    });
});
exports.generateFileUrl = (filename)=>{
  return process.env.URL+`uploads/`+ filename
}
exports.uploadCoverPicture = catchAsync(async (req, res, next) => {
  const { filename } = req.file;
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { coverPicture: generateFileUrl(filename) },
    { new: true, runValidators: true }
  );
  if (!user) return next(new AppError("User not found", 404));
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});;
exports.uploadProfilePicture = catchAsync(async (req, res, next) => {
  const file = req.file;
  console.log(file)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePicture: generateFileUrl(file.filename) },
    { new: true, runValidators: true }
  );
  if (!user) return next(new AppError("User not found", 404));
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});;; 