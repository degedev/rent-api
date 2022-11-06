import { AppError } from "./../../../../errors/AppError";
import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";
import {
  ICreateUserDTO,
  IUsersRepository,
} from "../../repositories/IUsersRepository";

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository") private usersRepository: IUsersRepository
  ) {}

  async execute({
    name,
    username,
    email,
    driver_license,
    password,
  }: ICreateUserDTO): Promise<void> {
    const checkIfEmailAlreadyExists = await this.usersRepository.findByEmail(
      email
    );

    if (checkIfEmailAlreadyExists) {
      throw new AppError(`Email ${email} already exists`);
    }

    const checkIfUsernameAlreadyExists =
      await this.usersRepository.findByUsername(username);

    if (checkIfUsernameAlreadyExists) {
      throw new AppError(`Username ${username} already exists`);
    }

    const encryptedPassword = await hash(password, 8);

    await this.usersRepository.create({
      name,
      username,
      email,
      driver_license,
      password: encryptedPassword,
    });
  }
}

export { CreateUserUseCase };
