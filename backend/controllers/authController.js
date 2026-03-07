const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ======================
// SIGNUP
// ======================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let user = await User.findOne({ email });

    if (user) {
      if (user.verified) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        user.name = name;
        user.password = hashedPassword;
        user.otp = otp;
        await user.save();
      }
    } else {
      user = new User({ name, email, password: hashedPassword, otp, verified: false });
      await user.save();
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`
    });

    res.json({ message: "Signup successful. OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// VERIFY OTP
// ======================
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    user.verified = true;
    user.otp = null;
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Account verified successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// LOGIN
// ======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.verified) return res.status(401).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// GET ME
// ======================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// UPDATE USER PROFILE
// ==========================================
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;

    if (email && email !== user.email) {
      if (!otp || user.otp !== otp) return res.status(400).json({ message: "Invalid OTP for email verification" });

      const existingEmail = await User.findOne({ email });
      if (existingEmail) return res.status(400).json({ message: "Email is already in use" });

      user.email = email;
      user.otp = null;
    }

    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

exports.sendUpdateOtp = async (req, res) => {
  try {
    const { newEmail } = req.body;
    if (!newEmail) return res.status(400).json({ message: "New email is required" });

    const existingEmail = await User.findOne({ email: newEmail });
    if (existingEmail) return res.status(400).json({ message: "Email is already in use by another account" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: newEmail,
      subject: "Verify your new email address",
      text: `Your OTP to change your email is ${otp}`
    });

    res.json({ message: "OTP sent to new email" });
  } catch (error) {
    res.status(500).json({ message: "Server error while sending OTP" });
  }
};

// ==========================================
// RESEND OTP (For Signup)
// ==========================================
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Resend OTP Verification",
      text: `Your new OTP is ${otp}`
    });

    res.json({ message: "A new OTP has been sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// FORGOT PASSWORD (Send OTP)
// ==========================================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP to reset your password is ${otp}`
    });

    res.json({ message: "Password reset OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// RESET PASSWORD (Verify OTP & Save new password)
// ==========================================
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null; // clear OTP
    await user.save();

    res.json({ message: "Password reset successfully. You can now login." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};