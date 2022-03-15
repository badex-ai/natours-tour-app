/* eslint-disable no-console */
const mongoose = require('mongoose');
const slugify = require('slugify');

//const User = require('./usermodels');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Each tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 character'],
      minlength: [10, 'A tour name must have less or equal than 10 character'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'a tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficulty',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      //so that we can round hte ratingsaverage to one dec place
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    slug: String,
    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price '],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // the 'this' keyword can only work when creating a new document
          //'this' only points to current doc on New documet creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description '],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startDates: [Date],
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    //embedding format for data modelling (the linking is done authomatically)
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    //data modelling using the reference method
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  //schema option meaning that we want to allow the database to output the
  //virtual properperties either when its json or an object
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//creating indexes for the most queried fields (price ratingsAverage  which is a compound index ), slug and startLocation
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
// index for the geospatial data
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//VIRTUAL POPULATE for populating the the schema with reviews from child  since the number of reviews is not fixed and it grows without persisting the information to the database
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
//DOCUMENT MIDDLEWARE : runs before .save() and .create() and doesn't work for .insertMany()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
//this is for embedding the userId into the database collection
// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
tourSchema.pre('save', function (next) {
  console.log('Will save document...');
  next();
});
tourSchema.post('save', function (doc, next) {
  // console.log(doc);
  next();
});

//QUERY MIDDLEWARE
// the  query middleware can make another query stick to the major query hook
//it can also give access to the object with (this)
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({ path: 'guides', select: '-__v -passwordChangedAt' });
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  // console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ match: { secretTour: { $ne: true } } });
//   next();
// });
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
