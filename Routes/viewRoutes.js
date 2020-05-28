const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get(
  '/',
  bookingController.createBookingCheckout,
  viewsController.getOverview
);

router.get('/tour/:slug', viewsController.getTour);
// authController.isLoggedIn,

router.get('/login', viewsController.getLoginForm);

router.get('/Me', authController.protect, viewsController.getAccount);
router.get('/My-tours', authController.protect, viewsController.getMyTours);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
