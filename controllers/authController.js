const jwt = require('jsonwebtoken');
const AppError = require('./../middlewares/AppError');
const catchAsync = require('./../middlewares/catchAsync');
const bcrypt = require("bcrypt");
const User = require('./../models/UserModel');

exports.signup = catchAsync(async (req, res, next) => {
    if (typeof req.body.password === "number"){req.body.password = req.body.password.toString();}
    const newUser =  await User.create(req.body);
    console.log(req.body.password);
    res.status(200).json({
      status: "success",
      data: {
        newUser,
      },
    });
  }
);

exports.login = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;
       
  if (typeof password === "number") password = password.toString();

  if (!email || !password)return res.status(400).json({ status: "fail", message: "Please provide email and password" });
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res
      .status(401)
      .json({ status: "fail", message: "Incorrect email or password" });
  // Generate JWT token

  const token = jwt.sign({ _id: user._id }, "ACCESS_TOKEN_SECRET", {
    expiresIn: "1h",
  });
  res.cookie("Token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.status(200).json({ status: "success", token });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.Token) {
    token = req.cookies.Token;
  }
  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  jwt.verify(token, "ACCESS_TOKEN_SECRET", async (err, decoded) => {
    if (err) {
      return next(new AppError("Invalid token or token expired", 403));
    }

    const currentUser = await User.findById(decoded._id);
    if (!currentUser) {
      return next(
        new AppError("the user belonging to this token does not exist", 401)
      );
    }
    req.user = decoded;
    next();
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  const id = req.user._id;
  const user = await User.findById(id);
  if (!user) return next(new AppError("You are not Login my friend😂", 404));
  res.clearCookie("Token", { sameSite: true, secure: true });
  res.status(200).json({ status: "Logged out!" });
});
