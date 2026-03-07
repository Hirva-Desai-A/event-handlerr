const nodemailer = require("nodemailer");

const sendOTP = async (email, otp) => {

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Your OTP",
        text: `Your OTP is ${otp}`
    });

}

module.exports = sendOTP;