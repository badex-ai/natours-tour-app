const Review = require('../models/reviewmodel');

const factory = require('./handlerfactory');

//const catchAsync = require('./../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.setTourUserIds = (req, res, next) => {
  // sets the user information from the route and auth middlerware to the body req info
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.getReview = factory.getOne(Review);
