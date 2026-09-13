import { Router } from "express";
import { registerController, loginController, refreshController } from "./auth.controller";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/refresh", refreshController);

export default authRouter;