const Post = require("./../models/PostModel");
const User = require("./../models/UserModel");
const AppError = require("./../middlewares/AppError");
const catchAsync = require("./../middlewares/catchAsync");
const {generateFileUrl} = require('./userController')
exports.createPost = catchAsync(async (req, res, next) => {
    const id = req.user._id;
    const user = await User.findById(id);
    const files = req.files;
    const imagesURL = files.map((file) => generateFileUrl(file.filename));
    if (!user) return next(new AppError("User not found", 404));
    const newPost = new Post({
      ...req.body,
      images: files ? imagesURL : undefined,
      user: req.user._id,
    });
    await newPost.save({ validateBeforeSave: false });
    user.posts.push(newPost._id);   
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      data: {
        post: newPost,
      },
    });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError("Post not found", 404));
  const sameUserOrNot = post.user.toString() === req.user._id.toString()? true : false;
  if(!sameUserOrNot) return next(new AppError("You are not owner of this post 🤬", 404));
  // const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });
  const keys = Object.keys(req.body);
  keys.forEach((key)=>post[key]=(req.body)[key])
  await post.save({ validateBeforeSave: false });
  
  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});
exports.getAllposts = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) return next(new AppError("User not found", 404));
  const blockedUserId = user.blockList.map((id)=>id.toString());
  const posts = await Post.find({ user: { $nin: blockedUserId } }).populate(
    "user",
    "username fullname profilePicture"
  );
    res.status(200).json({
      status: "success",
      data: {
        posts,
      },
    });
});
exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  console.log(post);
  if (!post) return next(new AppError("Post not found", 404));
  const sameUserOrNot = post.user.toString() === req.user._id.toString()? true : false;
  if(!sameUserOrNot) return next(new AppError("You are not owner of this post ��", 404));
  await Post.deleteOne({ _id: req.params.id });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.createLike = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return next(new AppError("Post not found", 404));
  if (post.likes.includes(req.user._id))return next(new AppError("You have already liked this post!", 404));
  post.likes.push(req.user._id);
  await post.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
});;
exports.dislikePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return next(new AppError("Post not found", 404));
  if (!post.likes.includes(req.user._id)) return next(new AppError("You have not liked this post!", 404));
  post.likes = post.likes.filter((like) => like.toString() !== req.user._id);
  await post.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message:'you are dislike this user'
  });
}); 