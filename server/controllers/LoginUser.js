import asyncHandler from "express-async-handler";
import client from "../database/connectDB.js";
import { comparePassword } from "../model/HashPassword.js";
import { generateAccessToken } from "../config/TokenGeneration.js";

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate the input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check if the user exists
  const checkUser = await client.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (checkUser.rows.length === 0) {
    return res.status(401).json({ message: "Invalide User Credentails" });
  }
  //   compare password
  const comparedPassword = await comparePassword(
    password,
    checkUser.rows[0].password
  );
  if (!comparedPassword) {
    return res.status(401).json({ message: "Invalid User Credentials" });
  }

  //   generate token
  const token = generateAccessToken({
    id: checkUser.rows[0].id,
    email: checkUser.rows[0].email,
  });
  res.setHeader("Authorization", `Bearer ${token}`);

  delete checkUser.rows[0].password;
  delete checkUser.rows[0].created_at;

  res.status(200).json({
    message: "Login successful",
    user: checkUser.rows[0],
    token: token,
  });
});

export default loginUser;
