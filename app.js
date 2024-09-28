const express = require("express");
const connectDB = require("./database/db");
const AppError = require('./middlewares/AppError');
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const userRoute = require('./routes/usersRouter');
const postRoute = require('./routes/postRouter');
const storyRoute = require('./routes/storiesRouter');
const conversationRoute = require('./routes/conversationRouter');
const commentRoute = require('./routes/commentRouter');
const messageRoute = require('./routes/messageRouter');
const morgan = require("morgan");
dotenv.config({ path: "./config.env" });
const path = require("path");
const globalErrorHandler = require("./controllers/errController");
connectDB;
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/comments", commentRoute);
app.use("/api/v1/stories", storyRoute);
app.use("/api/v1/conversations", conversationRoute);
app.use("/api/v1/messages", messageRoute);


app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
const port =3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
