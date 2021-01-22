import { Router, Request, Response } from "express";
const authenticatedRouter = Router();
//Routes that are only accecible if users are signed in
//but this does not  matter because we have requierAuth HOC
//that kicks the user out if they are not authenticated
authenticatedRouter.post("/post-ad");
export default authenticatedRouter;
