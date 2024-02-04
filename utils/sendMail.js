import nodemailer from "nodemailer";

function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PWD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is: ${otp}`,
  };

  return transporter.sendMail(mailOptions);
}

export { sendOTP };