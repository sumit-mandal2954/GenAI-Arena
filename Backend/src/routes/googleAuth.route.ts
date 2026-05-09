import Router from "express";
import { googleAuth, googleAuthCallback } from "../controller/googleAuth.controller.js";

const googleAuthRouter = Router();



googleAuthRouter.get("/google", googleAuth);
googleAuthRouter.get("/google/callback", googleAuthCallback);

export default googleAuthRouter;