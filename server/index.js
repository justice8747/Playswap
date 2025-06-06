import express from "express";
import client from "./database/connectDB.js";
import userRoutes from "./routes/UserRoutes.js";
import SpotifyRoutes from "./routes/SpotifyRoutes.js";
import YtmusicRoutes from "./routes/YtmusicRoutes.js";
import { createUserTable } from "./database/userTables.js";
import session from "express-session";
import passport from "passport";
import { googleStrategy } from "./config/googleStrategy.js";
import bodyParser from "body-parser";
import { createAccessTokenTable } from "./database/AccesTokenTable.js";

import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 5000;

const app = express();

client.connect((err) => {
  if (err) {
    console.error("Connection error", err.stack);
  } else {
    console.log("Connected to the database");
  }
});

createUserTable();
createAccessTokenTable();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(googleStrategy);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello from here");
});

app.use("/", userRoutes);
app.use("/", SpotifyRoutes);
app.use("/", YtmusicRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
