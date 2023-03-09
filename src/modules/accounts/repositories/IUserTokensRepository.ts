import { UserTokens } from "../entities/UserTokens";

interface ICreateUserTokenDTO {
  user_id: string;
  expires_date: Date;
  refresh_token: string;
}

interface IUsersTokensRepository {
  create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserTokens>;

  findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens>;

  deleteByUserId(user_id: string): Promise<void>;
  findByToken(refresh_token: string): Promise<UserTokens>;
}

export { IUsersTokensRepository, ICreateUserTokenDTO };
