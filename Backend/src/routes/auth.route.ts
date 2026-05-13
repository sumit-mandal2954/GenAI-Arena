import Router from "express";
import {
  registerController,
  loginController,
  getCurrentUser,
  guestLoginController,
} from "../controller/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { registerValidation, loginValidation } from "../validator/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", registerValidation, registerController);
authRouter.post("/login", loginValidation, loginController);
authRouter.post("/guest-login", guestLoginController);
authRouter.get("/me", verifyToken, getCurrentUser);

export default authRouter;
