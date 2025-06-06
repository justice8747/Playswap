import client from "../database/connectDB.js";
export const getNewSpotifyAccessToken = async (
  refreshToken,
  clientId,
  clientSecret,
  userId
) => {
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
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }

    const data = await response.json();
    const { access_token, expires_in } = data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    await client.query(
      "UPDATE access_tokens SET access_token = $1, expires_at = $2 WHERE provider = 'spotify' AND user_id = $3 RETURNING *",
      [access_token, expiresAt, userId]
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNewYtmusicAccessToken = async (
  refreshToken,
  clientId,
  clientSecret,
  userId
) => {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }

    const data = await response.json();
    const { access_token, expires_in } = data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    await client.query(
      "UPDATE access_tokens SET access_token = $1, expires_at = $2 WHERE provider = 'Ytmusic' AND user_id = $3 RETURNING *",
      [access_token, expiresAt, userId]
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
