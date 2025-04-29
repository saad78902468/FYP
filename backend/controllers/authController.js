const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodemailer");
const crypto = require("crypto");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    // Send verification email
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const url = `${process.env.BASE_URL}/auth/verify/${token}`;

    await transporter.sendMail({
      to: email,
      subject: 'Verify Email',
      html: `<h2>Click to verify: <a href="${url}">Verify</a></h2>`
    });

    res.status(201).json({ message: "User registered. Check your email to verify." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    await User.findByIdAndUpdate(decoded.id, { verified: true });
    res.send("Email verified successfully");
  } catch {
    res.send("Invalid or expired token");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.verified) return res.status(403).json({ message: "Please verify your email" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
};

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteProfile = async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.json({ message: "User deleted" });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email not found" });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000;
  await user.save();

  const resetLink = `${process.env.BASE_URL}/auth/reset-password/${token}`;
  await transporter.sendMail({
    to: email,
    subject: 'Reset Password',
    html: `<p>Click here to reset password: <a href="${resetLink}">Reset</a></p>`
  });

  res.json({ message: "Reset email sent" });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }
  });
  if (!user) return res.status(400).json({ message: "Token invalid or expired" });

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: "Password reset successfully" });
};
