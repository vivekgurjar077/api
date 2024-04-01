
import Newuser from "../models/newuser.model.js";
import createError from "../utils/createError.js";

export const register = async (req, res, next) => {
  try {
    // Check if the email matches the desired pattern
    const emailRegex = /^[^\s@]+@gritty-tech\.com$/;
    if (!emailRegex.test(req.body.email)) {
      return next(createError(400, "Invalid email address!"));
    }

    // Create a new user
    const newUser = new Newuser({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      admin: req.body.admin || false,
      phone: req.body.phone
    });

    // Save the user to the database
    await newUser.save();

    // Send response
    res.status(201).send("User has been created.");
  } catch (err) {
    next(err);
  }
};

export const getAllNewUsers = async (req, res, next) => {
  try {
    const newUsers = await Newuser.find({});
    res.status(200).json(newUsers);
  } catch (err) {
    next(err);
  }
};


export const deletenewuser = async (req, res, next) => {
 
  try {
    const newuser = await Newuser.findById(req.params.id);

    await Newuser.findByIdAndDelete(req.params.id);
    res.status(200).send("Newuser has been deleted!");
  } catch (err) {
    next(err);
  }
};