/* eslint-disable prettier/prettier */

/* eslint-disable node/no-unsupported-features/es-syntax */
const nodemailer = require("nodemailer");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.username;
    this.form = `App Chat`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "development") {
      return nodemailer.createTransport({
        service: "gmail",
        host: process.env.GMAIL_HOST,
        port: process.env.GMAIL_PORT,
        secure: false, //! true for 465, false for other ports
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // eslint-disable-next-line no-unused-vars
  //send the actual email




  async sendNotification(user,action) {
const mailOptions = {
  from: this.form,
  to: this.to,
  text:`${user} is ${action}`
};
// 3) creatre a transport and send email
await this.newTransport().sendMail(mailOptions);
  }

};
