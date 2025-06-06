import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
  },
  (accessToken, refreshToken, profile, done) => {
    const email = profile.emails?.[0].value;

    const newUser = {
      email,
    };

    done(null, newUser);
  }
);
