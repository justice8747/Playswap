import asyncHandler from "express-async-handler";
import passport from "passport";
import client from "../database/connectDB.js";
import { generateAccessToken } from "../config/TokenGeneration.js"; // assuming you have this

export const googleCallback = asyncHandler(async (req, res) => {
  passport.authenticate("google", { failureRedirect: "/login" })(
    req,
    res,
    async () => {
      const email = req.user.email;

      // Check if user already exists
      const checkUser = await client.query(
        "SELECT * FROM users WHERE email = $1 AND is_google_user = $2",
        [email, true]
      );

      let user;

      if (checkUser.rows.length === 0) {
        // User doesn't exist, create new one
        const insertUser = await client.query(
          "INSERT INTO users (email, is_google_user) VALUES ($1, $2) RETURNING *",
          [email, true]
        );
        user = insertUser.rows[0];
      } else {
        user = checkUser.rows[0];
      }

      // Generate token and respond
      const token = generateAccessToken({
        id: user.id,
        email: user.email,
      });

      res.setHeader("Authorization", `Bearer ${token}`);
      delete user.created_at;

      res.status(200).json({
        message: "Authentication successful",
        user,
        token,
      });
    }
  );
});
