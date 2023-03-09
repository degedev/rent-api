import { getRepository, Repository } from "typeorm";

import { UserTokens } from "../../entities/UserTokens";
import {
  ICreateUserTokenDTO,
  IUsersTokensRepository,
} from "../IUserTokensRepository";

class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UserTokens>;

  constructor() {
    this.repository = getRepository(UserTokens);
  }

  async create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = this.repository.create({
      user_id,
      refresh_token,
      expires_date,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    const userToken = await this.repository.findOne({
      user_id,
      refresh_token,
    });

    return userToken;
  }

  async deleteByUserId(user_id: string): Promise<void> {
    await this.repository.delete(user_id);
  }

  async findByToken(refresh_token: string): Promise<UserTokens> {
    const userToken = this.repository.findOne({ refresh_token });

    return userToken;
  }
}

export { UsersTokensRepository };
