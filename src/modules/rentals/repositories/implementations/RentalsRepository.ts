import { getRepository } from "typeorm";
import { Repository } from "typeorm";
import { Rental } from "../../entities/Rental";
import { ICreateRentalDTO, IRentalsRepository } from "../IRentalsRepository";

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async create({
    car_id,
    expected_return_date,
    user_id,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      car_id,
      expected_return_date,
      user_id,
    });

    await this.repository.save(rental);

    return rental;
  }

  async findOpenRentalByCarId(car_id: string): Promise<Rental> {
    const openRentalByCarId = await this.repository.findOne({ car_id });

    return openRentalByCarId;
  }
  async findOpenRentalByUserId(user_id: string): Promise<Rental> {
    const openRentalByUserId = await this.repository.findOne({ user_id });

    return openRentalByUserId;
  }
}

export { RentalsRepository };
