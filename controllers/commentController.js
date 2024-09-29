const User = require("./../models/UserModel");
const Comment = require("./../models/CommentModel");
const Post = require("./../models/PostModel");
const AppError = require("./../middlewares/AppError");
const catchAsync = require("./../middlewares/catchAsync");
const Email = require("./../middlewares/Email");
//  user=>اللي هيتبعتله الاميل await new Email(user, "").sendNotification(user.username, "comment you💬");   user.username => الشخص اللي عامل لوج ان
exports.createComment = catchAsync(async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.user._id;
    const post = await Post.findById(postId).populate('user','username email');
    if (!post) return next(new AppError("Post not found", 404));
    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found", 404));
    const comment = await Comment.create({
        user: userId,
        post: postId,
        ...req.body
    });
    post.comments.push(comment);
    await post.save({validateBeforeSave:false});
    await new Email(user, "").sendNotification(
    user.username,
    "comment you💬"
    );
    res.status(201).json({
        status: "success",
        data: {
            comment
        }
    })
});
exports.createReplay = catchAsync(async (req, res, next) => {
    const commentId = req.params.commentId;
    const userId = req.user._id;
    const user = await User.findById(userId);

    const comment = await Comment.findById(commentId).populate('user','email');
    if (!comment) return next(new AppError("Comment not found", 404));
    const Objectreplay = {
        user: userId,
        ...req.body
    }
    comment.replies.push(Objectreplay);
    await comment.save({validateBeforeSave:false});
    await new Email(comment.user, "").sendNotification(user.username, "reply on your comment💬");
    res.status(201).json({
      status: "success",
      message: "Replay saved successfully",
    });
});
exports.updateComment = catchAsync(async (req, res, next) => {
    const commentId = req.params.commentId;
    const userId = req.user._id;
    const comment = await Comment.findById(commentId);
    if (!comment) return next(new AppError("Comment not found", 404));
    if (userId.toString()!==comment.user.toString())return next(new AppError("You are not owner of this comment 🤬", 404));
    await Comment.updateOne({text: req.body.text});
    res.status(200).json({
        status: "success",
        message: "Comment updated successfully",
    });
});
exports.updateReplay = catchAsync(async (req, res, next) => {
    const commentId = req.params.commentId;
    const replayId = req.params.replayId;
    const userId = req.user._id;
    const comment = await Comment.findById(commentId);
    if (!comment) return next(new AppError("Comment not found", 404));
    const replayIndex = comment.replies.findIndex((replay) => replay._id.toString() === replayId.toString());
    console.log(replayIndex);
    if(replayIndex===-1){
        return next(new AppError("Replay not found", 404));
    }
    const replay = comment.replies[replayIndex];
    console.log(replay);
    if (userId.toString()!==replay.user.toString())return next(new AppError("You are not owner of this replay 🤬", 404));
    console.log(req.body.text)
    comment.replies[replayIndex].text = req.body.text;
    await comment.save({validateBeforeSave: false});
    res.status(200).json({
        status: "success",
        message: "Replay updated successfully",
    });
});
const popualteUserDetails = async(comments)=>{
    for (const comment of comments){
        await comment.populate('user', 'username fullname profilePicture');
        if(comment.replies.length > 0) await comment.populate('user', 'username fullname profilePicture');
    }
}
exports.getCommentByPost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.postId);
    if(!post) return next(new AppError("not found post", 404));
    let comments = await Comment.find({post:req.params.postId});
    await popualteUserDetails(comments);
    res.status(200).json({
        status: "success",
        data: {
            comments
        }
    });
}); 
exports.deleteComment = catchAsync(async (req, res, next) => {
    const commentId = req.params.commentId;
    const userId = req.user._id;
    const comment = await Comment.findById(commentId);
    const post = await Post.findOne({comments:commentId});
    if(!comment) return next(new AppError("not found comment", 404));
    if (userId !== comment.user.toString() || post.user.toString() !== comment.user.toString())return next(new AppError("the owner of comment or post can delete this only🤬", 404));
              
        await Post.findOneAndUpdate(
          { comments: commentId },
          { $pull: { comments: commentId } },
          { new: true }
        );

        await comment.deleteOne();
      res.status(204).json({
        status: "success",
        data: null,
      });
});
exports.deleteReplay = catchAsync(async (req, res, next) => {
    const commentId = req.params.commentId;
    const replayId = req.params.replayId;
    const comment = await Comment.findById(commentId);
    if(!comment) return next(new AppError("not found comment", 404));
    comment.replies = comment.replies.filter(
        (reply) => reply.toString() !== replayId
    );
    await comment.save({validateBeforeSave:false});
    res.status(204).json({
        status: "success",
        data: null,
    });
});
exports.createLikeComment = catchAsync(async (req, res, next) => {
    const commentId = req.params.commentId;
    const userId = req.user._id;
    const user = await User.findById(userId);
    const comment = await Comment.findById(commentId).populate('user','email');
    if (!comment) return next(new AppError("Comment not found", 404));
    if (comment.likes.includes(userId)) {
        return next(new AppError("You have already liked this comment", 400));
    }
    comment.likes.push(userId);
    await comment.save({validateBeforeSave: false});

    await new Email(comment.user, "").sendNotification(
      user.username,
      "Like on your comment👍"
    );

    res.status(200).json({
      status: "success",
      message: 'Like Created'
    });
}); 
exports.createDislikeComment = catchAsync(async (req, res, next) => {
    const commentId = req.params.commentId;
    const userId = req.user._id;
    const comment = await Comment.findById(commentId);
    if (!comment) return next(new AppError("Comment not found", 404));
    if(!comment.likes.includes(userId))return next(new AppError("You don't create like before this", 404));
    comment.likes = comment.likes.filter((like) => like.toString() !== userId);
    comment.save({validateBeforeSave:false});
    res.status(200).json({
      status: "success",
      message: 'Dislike Created'
    });
});
exports.createlikeReplay = catchAsync(async (req, res, next) => {
    const commentId = req.params.commentId;
    const replyId = req.params.replayId;
    const userId = req.user._id;
    const user = await User.findById(userId);
    const comment = await Comment.findById(commentId).populate('user','email');
    if (!comment) return next(new AppError("Comment not found", 404));
    const replyComment = comment.replies.find(
      (reply) => reply.id.toString() === replyId
    );
    if (!replyComment) return next(new AppError("Reply not found", 404));
    if (replyComment.likes.includes(userId))
      return next(new AppError("You are like this replay already", 404)); 
    replyComment.likes.push(userId);
    await comment.save({ validateBeforeSave: false });
    await new Email(comment.user, "").sendNotification(
      user.username,
      "Like on your reply comment👍"
    );
    res.status(200).json({
      status: "success",
      message:'DONE! Like Reply'
    })
});
exports.createdislikeReplay = catchAsync(async (req, res, next) => {
    const commentId = req.params.commentId;
    const replyId = req.params.replayId;
    const userId = req.user._id;
    const comment = await Comment.findById(commentId);
    if (!comment) return next(new AppError("Comment not found", 404));
    const replyComment = comment.replies.id(replyId);
    if(!replyComment.likes.includes(userId)) return next(new AppError("You don't put like to this reply yet",404));
    replyComment.likes = replyComment.likes.filter(likes => likes.toString()!==userId);
    await comment.save({ validateBeforeSave: false });
    res.status(200).json({
        status: "success",
        message: "DONE! Dis Like Reply",
    });
});

