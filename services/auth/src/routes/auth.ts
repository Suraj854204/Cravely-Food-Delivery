import express from "express";

import {
  signupUser,
  addUserRole,
  myProfile,
  googleLogin,
  forgotPassword,
  resetPassword,
  loginWithEmail,
} from "../controllers/auth.js";

import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginWithEmail);

router.put("/add/role", isAuth, addUserRole);
router.get("/me", isAuth, myProfile);

router.post("/google-login", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/test", (req, res) => {
  res.json({ success: true });
});

export default router;