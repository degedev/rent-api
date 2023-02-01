import { Car } from "../../entities/Car";
import {
  ICarsRepository,
  ICreateCarsDTO,
  IFindAvailableCars,
} from "../ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository {

  cars: Car[] = [];

  async create({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
    specifications,
    id,
  }: ICreateCarsDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      specifications,
      id,
    });

    this.cars.push(car);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = this.cars.find((car) => car.license_plate === license_plate);

    return car;
  }

  async findAvailable(data: IFindAvailableCars): Promise<Car[]> {
    const cars = this.cars.filter(
      (car) =>
        car.available === true &&
        (!data.name || data.name === car.name) &&
        (!data.brand || data.brand === car.brand) &&
        (!data.category_id || data.category_id === car.category_id)
    );

    return cars;
  }

  async findById(id: string): Promise<Car> {
    const car = this.cars.find((car) => car.id === id);

    return car;
  }

  async updateAvailableStatus(id: string, available: boolean): Promise<void> {
    const findIndex = this.cars.findIndex(car => car.id === id);
    this.cars[findIndex].available = available;
  }
}

export { CarsRepositoryInMemory };
