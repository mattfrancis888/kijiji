import { Router, Request, Response } from "express";
const authenticatedRouter = Router();
//Routes that are only accecible if users are signed in
authenticatedRouter.post("/post-ad");
export default authenticatedRouter;
