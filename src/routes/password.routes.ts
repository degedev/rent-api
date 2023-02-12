import { Router } from "express";

import { ResetPasswordUserController } from "../modules/accounts/useCases/resetPasswordUser/ResetPasswordUserController";
import { SendForgotPassordMailController } from "../modules/accounts/useCases/sendForgotPassowordMail/SendForgotPassordMailController";

const passwordRoutes = Router();

const sendForgotPasswordController = new SendForgotPassordMailController();
const resetPasswordController = new ResetPasswordUserController();

passwordRoutes.post("/forgot", sendForgotPasswordController.handle);
passwordRoutes.post("/reset", resetPasswordController.handle);

export { passwordRoutes };
