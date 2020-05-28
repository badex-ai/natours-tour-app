const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Badamasi Aliu <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //sendgrid
      return nodemailer.createTransport({
        service: 'Sendgrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }
    return nodemailer.createTransport({
      //  service: 'Gmail',
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    //Render html based on a pug Template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    //Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
      //html:
    };

    //create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'welcome to the Natours family ');
  }

  async sendPasswordReset(){
    await this.send(
      'passwordReset ',
      'Your password reset token (valid for only 10minutes)'
    );
  }
};


// Using nodemailer/ mailtrap  as our service provider
// const sendEmail = async options => {
//   // create a tranporter
//   const transporter = nodemailer.createTransport({
//     //  service: 'Gmail',
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD
//     }
//     //Activate in gmail "less secure app" option
//   });
//   //Define the email options
//   const mailOptions = {
//     from: 'Badamasi Aliu <hello@natour>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message
//     //html:
//   };
//   //Actually send the email
//   await transporter.sendMail(mailOptions);
// };

//module.exports = sendEmail;
