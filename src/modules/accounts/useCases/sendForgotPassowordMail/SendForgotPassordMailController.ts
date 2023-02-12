import { Request, Response } from "express";
import { container } from "tsyringe";

import { SendForgotPassordMailUseCase } from "./SendForgotPassordMailUseCase";

class SendForgotPassordMailController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;
    const sendForgotPassordMailUseCase = container.resolve(
      SendForgotPassordMailUseCase
    );

    await sendForgotPassordMailUseCase.execute(email);

    return res.send();
  }
}

export { SendForgotPassordMailController };
