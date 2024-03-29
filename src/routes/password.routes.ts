import { Router } from "express";

import { ResetPasswordUserController } from "../modules/accounts/useCases/resetPasswordUser/ResetPasswordUserController";
import { SendForgotPasswordMailController } from "../modules/accounts/useCases/sendForgotPassowordMail/SendForgotPasswordMailController";

const passwordRoutes = Router();

const sendForgotPasswordController = new SendForgotPasswordMailController();
const resetPasswordController = new ResetPasswordUserController();

passwordRoutes.post("/forgot", sendForgotPasswordController.handle);
passwordRoutes.post("/reset", resetPasswordController.handle);

export { passwordRoutes };
