/* eslint-disable no-console */

// EVERYTHING THAT CONCERNS THE MONGODB-MONGOOSE SERVER

const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({
  path: './config.env'
});
const app = require('./app');

// console.log(process.env);

//TODO:For replacing the p
// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

//TODO:For the Atlas mongo server
// mongoose
//   .connect(DB, {
//     // .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
//   })
//   .then(con => {
//     console.log(con.connections);
//     console.log('DB connection successful');
//   });

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    // .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(con => {
    console.log(con.connections);
    console.log('DB connection successful');
  });

// const testTour = new Tour({
//   name: 'The Parker Camper',
//   price: 997
// });
// testTour
//   .save()
//   .then(doc => {
//     console.log(doc);
//   })
//   .catch(err => {
//     console.log('Error:', err);
//   });
const port = 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
//globally handling unhandled rejections
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
