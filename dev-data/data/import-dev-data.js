/* eslint-disable no-console */
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('./../../models/tourmodel');
const Reviews = require('./../../models/reviewmodel');
const Users = require('./../../models/usermodels');

dotenv.config({ path: './config.env' });
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    // .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB connection successful');
  });

  // mongoose
  // .connect(
  //   'mongodb+srv://Badex-Ai:qIaQWTbVq6GmHGOU@cluster0-feurr.mongodb.net/natours?retryWrites=true&w=majority',
  //  {
  //   // .connect(DB, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //     useCreateIndex: true,
  //     useFindAndModify: false
  // })
  // .then(() => {
  //   console.log('DB connection successful');
  // });

//READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

//IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await Reviews.create(reviews);
    await Users.create(users, { validateBeforeSave: false });
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
};
//delete all data from db
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await Reviews.deleteMany();
    await Users.deleteMany();
    console.log('Data successfully deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

console.log(process.argv);
if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
