import { container } from "tsyringe";
import { Request, Response } from "express";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

class CreateRentalController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { expected_return_date, car_id } = req.body;
    const { id } = req.user;

    const createRentalUseCase = container.resolve(CreateRentalUseCase);

    const rental = await createRentalUseCase.execute({
      user_id: id,
      car_id,
      expected_return_date,
    });

    return res.status(201).json(rental);
  }
}

export { CreateRentalController };
