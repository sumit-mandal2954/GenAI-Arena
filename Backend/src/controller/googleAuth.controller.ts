import { Request, Response } from "express";
import passport from "../config/google.auth.js";
import jwt from "jsonwebtoken";

const baseUrl = 'http://localhost:5173'; // Frontend URL

// Initiates Google OAuth flow
export function googleAuth(req: Request, res: Response) {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
}

// Google OAuth callback handler
export function googleAuthCallback(req: Request, res: Response) {
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${baseUrl}/login`,
  })(req, res, () => {
    // Successful authentication - create JWT token
    const user = req.user as any;
    
    if (!user) {
      return res.redirect(`${baseUrl}/login`);
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Send token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    // Redirect to frontend home page
    // Token is in the cookie, so frontend will have access to it
    res.redirect(`${baseUrl}/`);
  });
}