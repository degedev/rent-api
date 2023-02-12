import { UserTokens } from "../../entities/UserTokens";
import {
  ICreateUserTokenDTO,
  IUsersTokensRepository,
} from "../IUserTokensRepository";

class UsersTokensRespositoryInMemory implements IUsersTokensRepository {
  usersTokens: UserTokens[] = [];

  async create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = new UserTokens();

    Object.assign(userToken, {
      expires_date,
      user_id,
      refresh_token,
    });

    this.usersTokens.push(userToken);

    return userToken;
  }
  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    const userToken = this.usersTokens.find(
      (ud) => ud.user_id === user_id && ud.refresh_token === refresh_token
    );

    return userToken;
  }
  async deleteByUserId(user_id: string): Promise<void> {
    const userToken = this.usersTokens.find((ut) => ut.user_id === user_id);
    this.usersTokens.splice(this.usersTokens.indexOf(userToken));
  }

  async findByToken(token: string): Promise<UserTokens> {
    const userToken = this.usersTokens.find((ut) => ut.refresh_token === token);

    return userToken;
  }
}

export { UsersTokensRespositoryInMemory };
