import { User } from "../entities/User";

interface ICreateUserDTO {
  name: string;
  username: string;
  password: string;
  email: string;
  driver_license: string;
}

interface IUsersRepositories {
  create(data: ICreateUserDTO): Promise<void>;
  findByEmail(email: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
}

export { IUsersRepositories, ICreateUserDTO };
