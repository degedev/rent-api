import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "../../../../config/auth";
import { AppError } from "../../../../errors/AppError";
import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";
import { IUsersTokensRepository } from "../../repositories/IUserTokensRepository";

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
class RefreshTokenUseCae {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayJsDateProvider")
    private dateProvider: IDateProvider
  ) {}
  async execute(token: string) {
    const {
      secret_refresh_token,
      expires_in_refresh_token,
      refresh_token_expiration_days,
    } = auth;

    const { sub, email } = verify(token, secret_refresh_token) as IPayload;

    const user_id = sub;

    const userToken =
      await this.usersTokensRepository.findByUserIdAndRefreshToken(
        user_id,
        token
      );

    if (!userToken) {
      throw new AppError("Refresh Token does not exists");
    }

    await this.usersTokensRepository.deleteByUserId(userToken.id);

    const refresh_token = sign({ email }, secret_refresh_token, {
      subject: user_id,
      expiresIn: expires_in_refresh_token,
    });

    const expires_date = this.dateProvider.addDays(
      refresh_token_expiration_days
    );

    await this.usersTokensRepository.create({
      refresh_token,
      user_id,
      expires_date,
    });

    return refresh_token;
  }
}

export { RefreshTokenUseCae };
