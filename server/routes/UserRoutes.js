import express from "express";
import registerUser from "../controllers/RegisterUser.js";
import loginUser from "../controllers/LoginUser.js";
import passport from "passport";
import { googleCallback } from "../controllers/googleAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google-callback", googleCallback);
router.g;

export default router;
