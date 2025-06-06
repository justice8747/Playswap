import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();

export const spotifyAuth = asyncHandler(async (req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URL;
  const scope = "user-read-private user-read-email";

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${encodeURIComponent(
    scope
  )}`;

  // Redirect the user to the Spotify authorization URL
  res.redirect(authUrl);
});
