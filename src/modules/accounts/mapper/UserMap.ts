import { instanceToInstance } from "class-transformer";

import { User } from "../entities/User";

interface IUserResponseDTO {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  driver_license: string;
  getAvatarUrl(): string;
}
class UserMap {
  static toDTO({
    id,
    name,
    username,
    email,
    avatar,
    driver_license,
    getAvatarUrl,
  }: User): IUserResponseDTO {
    const user = instanceToInstance({
      id,
      name,
      username,
      email,
      avatar,
      driver_license,
      getAvatarUrl,
    });
    return user;
  }
}

export { UserMap, IUserResponseDTO };
