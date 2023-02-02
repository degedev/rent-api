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
    id,
    end_date,
    total,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      car_id,
      expected_return_date,
      user_id,
      id,
      end_date,
      total,
    });

    await this.repository.save(rental);

    return rental;
  }

  async findOpenRentalByCarId(car_id: string): Promise<Rental> {
    const openRentalByCarId = await this.repository.findOne({
      where: { car_id, end_date: null }
    });

    return openRentalByCarId;
  }
  async findOpenRentalByUserId(user_id: string): Promise<Rental> {
    const openRentalByUserId = await this.repository.findOne({
      where: { user_id, end_date: null },
    });

    return openRentalByUserId;
  }


  async findRentalById(rental_id: string): Promise<Rental> {
    const rental = await this.repository.findOne({ id: rental_id });

    return rental;
  }
}

export { RentalsRepository };
