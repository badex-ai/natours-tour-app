const express = require('express');
const reviewsController = require('./../controllers/reviewsController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(
    authController.restrictTo('user', 'admin'),
    reviewsController.setTourUserIds,
    reviewsController.createReview
  );
router
  .route('/:id')
  .patch(
    authController.restrictTo('users', 'admin'),
    reviewsController.updateReview
  )
  .get(reviewsController.getReview)
  .delete(reviewsController.deleteReview);
module.exports = router;
