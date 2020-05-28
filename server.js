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

//TODO:For replacing the password
// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

//TODO:For the Atlas mongo server
// mongoose
//   .connect(
//     'mongodb+srv://Badex-Ai:qIaQWTbVq6GmHGOU@cluster0-feurr.mongodb.net/natours?retryWrites=true&w=majority',
//     {
//     // .connect(DB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
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
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(con => {
    console.log(con.connections);
    console.log('DB connection successful');
  });


const port = 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//globally handling unhandled rejections , unresolved promises
//we listen to the unhandledRejection event subscribe to the error and then log the error to the console
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);

  //close the server
  server.close(() => {
    //close the app if the error is detected
    //0 stands for success 1 stands for uncalled exceptions
    process.exit(1);
  });
});
