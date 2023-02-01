import { Car } from "../entities/Car";
import { Specification } from "../entities/Specification";

interface ICreateCarsDTO {
  name: string;
  description: string;
  daily_rate: number;
  license_plate: string;
  fine_amount: number;
  brand: string;
  category_id: string;
  specifications?: Specification[];
  id?: string;
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
  findById(id: string): Promise<Car>;
  updateAvailableStatus(id: string, available: boolean): Promise<void>;
}

export { ICarsRepository, ICreateCarsDTO, IFindAvailableCars };
