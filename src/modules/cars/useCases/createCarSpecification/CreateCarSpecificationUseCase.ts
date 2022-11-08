import { AppError } from "./../../../../errors/AppError";
import { inject, injectable } from "tsyringe";
import { ICarsRepository } from "../../repositories/ICarsRepository";
import { ISpecificationsRepository } from "../../repositories/ISpecificationsRepository";
import { Car } from "../../entities/Car";

interface IRequest {
  car_id: string;
  specifications_id: string[];
}
@injectable()
class CreateCarSpecificationUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("SpecificationsRepository")
    private specificationsRepository: ISpecificationsRepository
  ) {}

  async execute({ car_id, specifications_id }: IRequest): Promise<Car> {
    const checkIfCarExists = await this.carsRepository.findById(car_id);

    if (!checkIfCarExists) {
      throw new AppError(`Car does not exists`);
    }

    const specifications = await this.specificationsRepository.findByIds(
      specifications_id
    );

    checkIfCarExists.specifications = specifications;

    await this.carsRepository.create(checkIfCarExists);

    return checkIfCarExists;
  }
}

export { CreateCarSpecificationUseCase };
