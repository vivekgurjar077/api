import User from "../models/user.model.js";
import router from "../routes/user.route.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import expressAsyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();

export const login = async (req, res, next) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ username: req.body.username });

    if (!user) return next(createError(404, "User not found!"));
    console.log(user);
    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or username!"));
    console.log(isCorrect);
    const token = jwt.sign(
      {
        id: user._id,
        admin: user.admin,
      },
      process.env.JWT_KEY
    );
      console.log(token);
    const { password, ...info } = user._doc;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(info);
  } catch (err) {
    console.log(JSON.stringify(err));
    next(err);
  }
};
router.get("/test",(req,res)=>{
  res.send("it works!");
})
export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};


export const register = async (req, res, next) => {
  try {
    // Check if the email matches the desired pattern
    const emailRegex = /^[^\s@]+@gritty-tech\.com$/;
    if (!emailRegex.test(req.body.email)) {
      return next(createError(400, "Invalid email address!"));
    }
    // Hash the password
    const hash = bcrypt.hashSync(req.body.password, 5);

    // Create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      admin: req.body.admin || false,
      phone:req.body.phone
    });

    // Save the user to the database
    await newUser.save();

    // Send response
    res.status(201).send("User has been created.");
  } catch (err) {
    next(err);
  }
};
