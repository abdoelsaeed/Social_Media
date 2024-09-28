const mongoose=require("mongoose")

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "you forgot the user"],
    },
    caption: {
      type: String,
      required: [true, "you forgot the caption"],
    },
    images: [
      {
        type: String,
        required: false,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);
const Post = mongoose.model("Post", postSchema);

module.exports=Post;