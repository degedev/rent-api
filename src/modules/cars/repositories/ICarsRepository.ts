import { Car } from "../entities/Car";

interface ICreateCarsDTO {
  name: string;
  description: string;
  daily_rate: number;
  license_plate: string;
  fine_amount: number;
  brand: string;
  category_id: string;
}

interface IFindAvailableCars {
  name?: string;
  brand?: string;
  category_id?: string;
}

interface ICarsRepository {
  create(data: ICreateCarsDTO): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car>;
  findAvailable(data: IFindAvailableCars): Promise<Car[]>;
}

export { ICarsRepository, ICreateCarsDTO, IFindAvailableCars };
