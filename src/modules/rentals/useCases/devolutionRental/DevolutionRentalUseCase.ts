import { AppError } from './../../../../errors/AppError';
import { inject, injectable } from "tsyringe";
import { ICarsRepository } from "../../../cars/repositories/ICarsRepository";
import { IRentalsRepository } from "../../repositories/IRentalsRepository";
import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";
import { Rental } from '../../entities/Rental';

interface IRequest {
  rental_id: string;
  user_id: string
}


@injectable()
class DevolutionRentalUseCase {

  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("DayJsDateProvider")
    private dateProvider: IDateProvider,
  ) { }

  async execute({ rental_id, user_id }: IRequest): Promise<Rental> {

    const rental = await this.rentalsRepository.findRentalById(rental_id);

    if (!rental) {
      throw new AppError("Rental does not exists");
    }

    const dateNow = this.dateProvider.dateNow();
    const minimun_daily = 1;
    const car = await this.carsRepository.findById(rental.car_id);

    let daily = this.dateProvider.compareInDays(
      rental.start_date,
      dateNow
    );

    if (daily <= 0) {
      daily = minimun_daily;
    }

    const delay = this.dateProvider.compareInDays(
      dateNow,
      rental.expected_return_date
    );

    let total = 0;

    if (delay > 0) {
      const calculate_fine = delay * car.fine_amount;
      total = calculate_fine;
    }

    total += daily * car.daily_rate;

    rental.end_date = this.dateProvider.dateNow();
    rental.total = total;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailableStatus(car.id, true);

    return rental;

  }

}

export { DevolutionRentalUseCase }