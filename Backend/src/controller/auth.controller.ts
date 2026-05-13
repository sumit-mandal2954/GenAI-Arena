import jwt from "jsonwebtoken";
import e, { Request, Response } from "express";
import userModel from "../models/auth.model.js";
import type { IUser } from "../models/auth.model.js";

const sendToken = (user: IUser, res: Response) => {
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "lax",
    maxAge: 3600000,
    path: "/"
  });

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

export async function registerController(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    const isUserExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await userModel.create({
      username,
      email,
      password,
    }) as IUser;

    sendToken(user, res);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { username,email,password } = req.body;
    
    const user = await userModel.findOne({
      $or: [{ username }, { email }],
    }) as IUser | null;

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    sendToken(user, res);

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function guestLoginController(req: Request, res: Response) {
  try {
    // Generate a unique guest username with timestamp
    const guestUsername = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const guestEmail = `${guestUsername}@guest.local`;

    const user = await userModel.create({
      username: guestUsername,
      email: guestEmail,
      password: undefined, // No password for guest users
    }) as IUser;

    sendToken(user, res);
  } catch (error) {
    console.error("Guest login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}


