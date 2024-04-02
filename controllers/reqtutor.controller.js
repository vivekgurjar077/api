import Reqtutor from "../models/reqtutor.model.js";
import createError from "../utils/createError.js";
import express from 'express';

export const createreqtutor = async (req, res, next) => {
  const newReqtutor = new Reqtutor({
    ...req.body,
  });

  try {
    const savedReqtutor = await newReqtutor.save();
    res.status(201).json(savedReqtutor);
  } catch (err) {
    next(err);
  }
};

export const deletereqtutor = async (req, res, next) => {
  if (!req.admin)
    return next(createError(403, "Only admin can delete a gig!"));
  try {
    const reqtutor = await Reqtutor.findById(req.params.id);

    await Reqtutor.findByIdAndDelete(req.params.id);
    res.status(200).send("Reqtutor has been deleted!");
  } catch (err) {
    next(err);
  }
};
export const getreqtutor = async (req, res, next) => {
  try {
    const reqtutor = await Reqtutor.findById(req.params.id);
    if (!reqtutor) next(createError(404, "Reqtutor not found!"));
    res.status(200).send(reqtutor);
  } catch (err) {
    next(err);
  }
};

export const getreqtutors = async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { 
      $or: [
        { title: { $regex: q.search, $options: "i" } },
        { features: { $regex: q.search, $options: "i" } },
        { shortTitle: { $regex: q.search, $options: "i" } }
      ]
    }),
    ...(q.features && { features: { $in: q.features.split(',') } }), // Search by features
    ...(q.shortTitle && { shortTitle: { $regex: q.shortTitle, $options: "i" } }) // Search by shortTitle
  };
  try {
    const reqtutors = await Reqtutor.find(filters).sort({ [q.sort]: -1 });
    res.status(200).send(reqtutors);
  } catch (err) {
    next(err);
  }
};