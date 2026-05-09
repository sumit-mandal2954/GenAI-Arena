// config/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./config.js";
import userModel from "../models/auth.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID as string,
      clientSecret: config.GOOGLE_CLIENT_SECRET as string,
      callbackURL: config.GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists, if not create a new user
        let user = await userModel.findOne({ email: profile.emails?.[0]?.value });
        
        if (!user) {
          // Create new user from Google profile
          user = await userModel.create({
            username: profile.displayName || profile.id,
            email: profile.emails?.[0]?.value,
            password: "google-oauth-user", // Placeholder password
            googleId: profile.id,
          });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user._id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;