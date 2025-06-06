import asyncHandler from "express-async-handler";
import { tokenExpred } from "../../services/CheckIfTokenExpired.js";
import { getNewSpotifyAccessToken } from "../../services/getNewAccessToken.js";
import client from "../../database/connectDB.js";
import dotenv from "dotenv";
dotenv.config();

export const getAllYtmusicPlaylists = asyncHandler(async (req, res) => {
  const useerId = req.user.useerId;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  let refreshToken;
  let accessToken;
  let expiresAt;
  const tokenRecode = await client.query(
    "SELECT * FROM access_tokens WHERE user_id = $1 AND provider = 'spotify'",
    [useerId]
  );

  if (tokenRecode.rows.length === 0) {
    return res
      .status(404)
      .json({ error: "No access token found for this user" });
  } else {
    refreshToken = tokenRecode.rows[0].refresh_token;
    accessToken = tokenRecode.rows[0].access_token;
    expiresAt = tokenRecode.rows[0].expires_at;
  }

  if (tokenExpred(expiresAt)) {
    getNewSpotifyAccessToken(refreshToken, clientId, clientSecret, useerId);
  }

  try {
    const token = await client.query(
      "SELECT * FROM access_tokens WHERE user_id = $1 AND provider = 'spotify'",
      [useerId]
    );

    if (token.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No access token found for this user" });
    } else {
      const response = await fetch(
        "https://www.googleapis.com/youtube/v3/playlists",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            part: "snippet",
            mine: true,
            maxResults: 50,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch playlists");
      }

      const data = await response.json();

      res.status(200).json({
        message: "Playlists fetched successfully",
        playlists: data.items,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
