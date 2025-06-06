import express from "express";
import { getYtmusicAccessToken } from "../controllers/GetAccessToken.js";
import { ytmusicAuth } from "../controllers/YtmusicAuth.js";
import { verifyToken } from "../config/TokenValidation.js";
import { getAllYtmusicPlaylists } from "../controllers/ytmusicControllers/GetAllYtmusicPlaylist.js";
const router = express.Router();

router.get("/youtube/callback", getYtmusicAccessToken);
router.get("/ytmusic/auth", ytmusicAuth);
router.get("/ytmusic/getplaylists", verifyToken, getAllYtmusicPlaylists);

export default router;
