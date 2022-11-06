import { AppError } from "./../errors/AppError";
import { NextFunction, Request, Response } from "express";
import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

export async function ensureAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.user;
  const usersReposiotry = new UsersRepository();

  const user = await usersReposiotry.findById(id);

  if (!user.isAdmin) {
    throw new AppError(`User ${user.username} is not an admin`);
  }

  return next();
}
