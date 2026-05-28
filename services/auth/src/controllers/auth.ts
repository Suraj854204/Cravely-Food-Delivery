import sendEmail from "../utils/sendEmail.js";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import TryCatch from "../middlewares/trycatch.js";
import { oauth2client } from "../config/googleConfig.js";
import axios from "axios";
import { Request, Response } from "express";

/* =========================================
   SIGNUP
========================================= */

export const signupUser = TryCatch(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "email",
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SEC as string,
      { expiresIn: "15d" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user,
    });
  }
);

/* =========================================
   LOGIN
========================================= */

export const loginWithEmail = TryCatch(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SEC as string,
      { expiresIn: "15d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  }
);

/* =========================================
   GOOGLE LOGIN
========================================= */

export const googleLogin = TryCatch(
  async (req: Request, res: Response) => {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Authorization code missing" });
    }

    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    const { email, name, picture } = userRes.data;

    if (!email) {
      return res.status(400).json({ message: "Could not retrieve email from Google" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture,
        provider: "google",
      });
    } else if (!user.image) {
      user.image = picture;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SEC as string,
      { expiresIn: "15d" }
    );

    res.status(200).json({
      message: "Google login successful",
      token,
      user,
    });
  }
);

/* =========================================
   FORGOT PASSWORD
========================================= */

export const forgotPassword = TryCatch(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    await sendEmail({
      to: email,
      subject: "Reset your Cravely password",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:32px;background:#0a0005;color:#fff;border-radius:16px">
          <h1 style="color:#ffb347">Cravely</h1>
          <h2>Reset your password</h2>
          <p style="color:rgba(255,255,255,0.6)">Click the button below. This link expires in <strong>15 minutes</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;margin-top:16px;padding:14px 32px;background:linear-gradient(135deg,#ff6b35,#e91e63);color:#fff;font-weight:700;text-decoration:none;border-radius:12px">
            Reset Password
          </a>
          <p style="margin-top:24px;font-size:12px;color:rgba(255,255,255,0.3)">
            If you didn't request this, ignore this email.
          </p>
        </div>
      `,
    });

    // ✅ FIX: Only ONE res.json() call (removed the duplicate that caused "headers already sent" crash)
    return res.status(200).json({ message: "Reset link sent to your email" });
  }
);

/* =========================================
   RESET PASSWORD
========================================= */

export const resetPassword = TryCatch(
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);

    // ✅ FIX: Use undefined instead of "null as unknown as Type" casting
    user.resetPasswordToken = undefined as unknown as string;
    user.resetPasswordExpire = undefined as unknown as Date;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  }
);