import { Router } from "express";
import { CreateUserController } from "../modules/accounts/useCases/createUser/CreateUserController";
import { UpdateUserAvatarController } from "../modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarControllert";
import uploadConfig from "../config/upload";
import multer from "multer";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const usersRoutes = Router();
const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();
const uploadAvatar = multer(uploadConfig.upload("./tmp/avatar"));

usersRoutes.post("/", createUserController.handle);
usersRoutes.patch(
  "/avatar",
  ensureAuthenticated,
  uploadAvatar.single("avatar"),
  updateUserAvatarController.handle
);

export { usersRoutes };
