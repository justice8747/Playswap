import asyncHandler from "express-async-handler";
import client from "../database/connectDB.js";
import dotenv from "dotenv";
import fetch from "node-fetch"; // <-- Add this import
import e from "express";

dotenv.config();

export const getAccessToken = asyncHandler(async (req, res) => {
  const code = req.query.code;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URL;

  if (!code) {
    return res.status(400).json({ error: "Authorization code is required" });
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }

    const data = await response.json();
    const { access_token, refresh_token, expires_in } = data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    await client.query(
      "INSERT INTO access_tokens (access_token, refresh_token, provider, expires_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [access_token, refresh_token, "spotify", expiresAt]
    );
    res.status(200).json({
      message: "Access token retrieved and stored successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const getYtmusicAccessToken = asyncHandler(async (req, res) => {
  const code = req.query.code;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI;

  if (!code) {
    return res.status(400).json({ error: "Authorization code is required" });
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }

    const data = await response.json();
    const { access_token, refresh_token, expires_in } = data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    await client.query(
      "INSERT INTO access_tokens (access_token, refresh_token, provider, expires_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [access_token, refresh_token, "Ytmusic", expiresAt]
    );
    res.status(200).json({
      message: "YouTube Music access token retrieved and stored successfully",
      access_token,
      refresh_token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
