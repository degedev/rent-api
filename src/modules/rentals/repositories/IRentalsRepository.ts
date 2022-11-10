import { Rental } from "../entities/Rental";

interface ICreateRentalDTO {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

interface IRentalsRepository {
  create(data: ICreateRentalDTO): Promise<Rental>;
  findOpenRentalByCarId(car_id: string): Promise<Rental>;
  findOpenRentalByUserId(user_id: string): Promise<Rental>;
}

export { IRentalsRepository, ICreateRentalDTO };
