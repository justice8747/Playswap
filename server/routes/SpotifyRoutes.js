import express from "express";
import { getAccessToken } from "../controllers/GetAccessToken.js";
import { verifyToken } from "../config/TokenValidation.js";
import { spotifyAuth } from "../controllers/Spotifyauth.js";
import { getAllSpotyPlaylists } from "../controllers/spotifyControllers/GetAllSpotifyPlaylists.js";

const router = express.Router();

router.get("/spotify/callback", getAccessToken);
router.get("/spotify/auth", spotifyAuth);
router.get("/spotify/getplaylists", verifyToken, getAllSpotyPlaylists);

export default router;
