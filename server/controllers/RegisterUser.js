import asyncHandler from "express-async-handler";
import client from "../database/connectDB.js";
import { hashPassword } from "../model/HashPassword.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate the input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check if the user already exists
  const existingUser = await client.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  if (existingUser.rows.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  //   hash the password
  const hashedPassword = await hashPassword(password);

  // Insert the new user into the database
  const newUser = await client.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
    [email, hashedPassword]
  );

  res
    .status(201)
    .json({ message: "User registered successfully", user: newUser.rows[0] });
});

export default registerUser;
