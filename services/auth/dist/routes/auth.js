import express from "express";
import { signupUser, loginWithEmail, googleLogin, forgotPassword, resetPassword, } from "../controllers/auth.js";
const router = express.Router();
/* =========================================
   AUTH ROUTES
========================================= */
router.post("/signup", signupUser);
router.post("/login", loginWithEmail);
router.post("/google-login", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
export default router;
