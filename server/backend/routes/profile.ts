import { Router, Request, Response } from "express";
import { getUserProfile } from "../controllers/profile";
const profileRouter = Router();
profileRouter.get("/profile", getUserProfile);
export default profileRouter;
