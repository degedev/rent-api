import { inject, injectable } from "tsyringe";
import { Car } from "../../entities/Car";
import { ICarsRepository } from "../../repositories/ICarsRepository";

interface IRequest {
  name?: string;
  brand?: string;
  category_id?: string;
}

@injectable()
class ListAvailableCarsUseCase {
  constructor(
    @inject("CarsRepository") private carsRepository: ICarsRepository
  ) {}

  async execute({ name, brand, category_id }: IRequest): Promise<Car[]> {
    const cars = this.carsRepository.findAvailable({
      name,
      brand,
      category_id,
    });

    return cars;
  }
}

export { ListAvailableCarsUseCase };
