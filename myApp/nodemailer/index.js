require("dotenv").config();

const nodemailer = require("nodemailer");

// const verificationBaseUrl = process.env.VERIFICATION_BASE_URL;

const nodemailerConfig = {
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "ramona.popa.diana@outlook.com",
    pass: "dia16us2002",
  },
};

let transporter = nodemailer.createTransport(nodemailerConfig);

async function sendVerificationEmail(email, verificationToken) {
  try {
    const mailOptions = {
      from: "ramona.popa.diana@outlook.com",
      to: email,
      subject: "Email Verification",
      text: `Please click on the following link to verify your email address: http://localhost:3000/users/verify/${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

module.exports = { sendVerificationEmail };

// function sendVerificationEmail(email, verificationToken) {
//   const nodemailerConfig = {
//     host: "smtp.office365.com",
//     port: 587,
//     secure: false,
//     auth: {
//       method: "LOGIN",
//       user: process.env.OUTLOOK_EMAIL,
//       pass: process.env.OUTLOOK_PASSWORD,
//     },
//   };

//   let transporter = nodemailer.createTransport(nodemailerConfig);

//   let mailOptions = {
//     from: "ramona.popa.diana@outlook.com",
//     to: email,
//     subject: "Email Verification",
//     text: `Click the link to verify your email: ${verificationBaseUrl}/users/verify/${verificationToken}`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Email sent: " + info.response);
//     }
//   });
// }

// module.exports = {
//   sendVerificationEmail: sendVerificationEmail,
// };
