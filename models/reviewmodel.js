const mongoose = require('mongoose');
const Tour = require('./tourmodel');

const reviewsSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  //when we have a property that not stored in the database but calculated this lets it appear in the output
  {
    toJSON: { virtual: true },
    toObject: { virtuals: true },
  }
);

//creating this index hepls us to know that the user and tour have to be unique at the same time
//meaning we cannot have duplicate review or more than one review from a particular user on a tour
reviewsSchema.index({ tour: 1, user: 1 }, { unique: true });

// We us populate to fill the field with their values
// when referenced in the schema the select key is used
// to remove unwanted fields in the response
reviewsSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({ path: 'user', select: 'name photo' });
  this.populate({ path: 'user', select: 'name photo' });
  next();
});

// we create the static method to calculate the averageRatings
//this is called directly on the schema
reviewsSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingAverage: 4.5,
    });
  }
};

reviewsSchema.post('save', function () {
  //calling the static method calcAverageRatings
  //this points to the review
  this.constructor.calcAverageRatings(this.tour);
});

//updating the tourmodle when the review has been updated
//we use findOneandupdate because to update the review but we dont have access to the doc
//we do not have access to the id of the tour model
reviewsSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  console.log(this.r);
  next();
});

reviewsSchema.post(/^findOneAnd/, async function () {
  //await this.findOne() doesnt work here because query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewsSchema);
module.exports = Review;
