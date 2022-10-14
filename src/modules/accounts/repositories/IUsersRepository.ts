interface ICreateUserDTO {
  name: string;
  username: string;
  password: string;
  email: string;
  driver_license: string;
}

interface IUsersRepositories {
  create(data: ICreateUserDTO): Promise<void>;
}

export { IUsersRepositories, ICreateUserDTO };
