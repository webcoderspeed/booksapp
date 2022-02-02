import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from '../models/userModel.js'

/**
 * @desc Auth user & generate token
 * @route POST /api/users/login
 * @access PUBLIC
 * @body  { email, password }
 */
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    throw Error("Please enter your email");
  }
  if (!password) {
    throw Error("Please enter your password");
  }


  const user = await User.findOne({ email: { '$regex': email, '$options': 'i' } });

  if (!user) {
    throw Error("User not found!");
  }

  if (user && user.isDeleted) {
    res.status(400);
    throw Error(
      "Your account is deleted make sure you register first before logging in again"
    );
  }

  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      name: user.name,
      email: user.email,
      isPaymentMade: user.isPaymentMade,
      totalEarning: user.totalEarning,
      token: generateToken(user?._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid password");
  }
});

/**
 * @desc Register a new user & generate token
 * @route POST /api/users
 * @access PUBLIC
 * @body  { name, email, password, role -> retailer | expert }
 */
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name) {
    throw Error("Please enter your name");
  }
  if (!email) {
    throw Error("Please enter your email");
  }
  if (!password) {
    throw Error("Please enter your password");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    userExists.name = name;
    await userExists.save();
    return res.status(201).json(userExists);
  }

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      name: user.name,
      email: user.email,
      isPaymentMade: user.isPaymentMade,
      totalEarning: user.totalEarning,
      token: generateToken(user?._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

/**
 * @desc get user profile
 * @route GET /api/users/profile
 * @access PRIVATE [ LOGGED IN USER PROFILE ]
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password").populate({
    path: "referredUser",
    model: "User"
  });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


/**
 * @desc increase user earning by referral
 * @route POST /api/users/referal
 * @access PRIVATE [ LOGGED IN USER PROFILE ]
 */

export const increaseUserEarning = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const referaledUser = await User.findById(req.body.userId);

  // if the both user are same then throw error you can't referal yourself
  if (user._id.toString() === referaledUser._id.toString()) {
    res.status(400);
    throw new Error("You can't referal yourself");
  }

  if (!referaledUser) {
    throw new Error("ReferaledUser not found");
  }

  if (referaledUser) {
    referaledUser.isPaymentMade = true;
    referaledUser.totalEarning += 10;
    await referaledUser.save();
  }

  if (user) {
    user.referredUser = referaledUser._id;
    await user.save();
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
})

/**
 * @desc get all users
 * @route GET /api/users
 * @access Public
 */

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").populate({
    path: "referredUser",
    model: "User"
  });
  res.status(200).json(users);
});

