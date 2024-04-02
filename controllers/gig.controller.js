import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";
import express from 'express';

export const createGig = async (req, res, next) => {
  const newGig = new Gig({
    ...req.body,
  });

  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    next(err);
  }
};

export const deleteGig = async (req, res, next) => {
  if (!req.admin)
    return next(createError(403, "Only admin can delete a gig!"));
  try {
    const gig = await Gig.findById(req.params.id);

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send("Gig has been deleted!");
  } catch (err) {
    next(err);
  }
};
export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) next(createError(404, "Gig not found!"));
    res.status(200).send(gig);
  } catch (err) {
    next(err);
  }
};

export const getGigs = async (req, res, next) => {
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
    const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });
    res.status(200).send(gigs);
  } catch (err) {
    next(err);
  }
};
