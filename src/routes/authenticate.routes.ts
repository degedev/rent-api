import { Router } from "express";
import { AuthenticateUserControler } from "../modules/accounts/useCases/authenticateUser/AuthenticateUserController";

const authenticateRoutes = Router();
const authenticateUserController = new AuthenticateUserControler();

authenticateRoutes.post("/sessions", authenticateUserController.handle);

export { authenticateRoutes };
