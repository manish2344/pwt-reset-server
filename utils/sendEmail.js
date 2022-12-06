const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const Token = require("../models/tokenModel");

module.exports = async (user, mailType) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user:process.env.EMAIL_USERNAME,
        pass:process.env.EMAIL_PASSWORD
      },
    });

    const encryptedToken = bcrypt
      .hashSync(user._id.toString(), 10)
      .replaceAll("/", "");
    const token = new Token({
      userid: user._id,
      token: encryptedToken,
    });
    await token.save();

    let emailContent, mailOptions;
    if (mailType == "verifyemail") {
      emailContent = `<div><h1>Please click on the below link to verify your email address</h1> <a href="https://teal-heliotrope-6deac1.netlify.app/${encryptedToken}">${encryptedToken}</a>  </div>`;
      mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: user.email,
        subject: "Verify Email For MERN Auth",
        html: emailContent,
      };
    } else {
      emailContent = `<div><h1>Please click on the below link to reset your password</h1> <a href="https://teal-heliotrope-6deac1.netlify.app/resetpassword/${encryptedToken}">${encryptedToken}</a>  </div>`;

      mailOptions = {
        from:process.env.EMAIL_USERNAME,
        to: user.email,
        subject: "Reset password For MERN Auth",
        html: emailContent,
      };
    }

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
