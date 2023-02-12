import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../errors/AppError";
import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";
import { ICarsRepository } from "../../../cars/repositories/ICarsRepository";
import { Rental } from "../../entities/Rental";
import { IRentalsRepository } from "../../repositories/IRentalsRepository";

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("DayJsDateProvider")
    private dateProvider: IDateProvider,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository
  ) {}

  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const checkCarUnavailable =
      await this.rentalsRepository.findOpenRentalByCarId(car_id);

    if (checkCarUnavailable) {
      throw new AppError("Car is unavailable");
    }

    const checkUserOpenRental =
      await this.rentalsRepository.findOpenRentalByUserId(user_id);

    if (checkUserOpenRental) {
      throw new AppError("User has a rental in progress");
    }

    const minimumHoursDiff = 24;
    const dateNow = this.dateProvider.dateNow();
    const compare = this.dateProvider.compareInHours(
      dateNow,
      expected_return_date
    );

    if (compare < minimumHoursDiff) {
      throw new AppError("Invalid return time");
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    await this.carsRepository.updateAvailableStatus(car_id, false);

    return rental;
  }
}

export { CreateRentalUseCase };
