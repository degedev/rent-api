import { AppError } from "./../../../../errors/AppError";
import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";
import { SpecificationsRepositoryInMemory } from "../../repositories/in-memory/SpecificationsRepositoryInMemory";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe("CreateCarSpecification", () => {
  beforeEach(() => {
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });

  it("[CreateCarSpecification] should be able to add a new specification to a car", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Name Car",
      description: "Descripton Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand car",
      category_id: "category",
    });

    const specification = await specificationsRepositoryInMemory.create({
      description: "Descripton specification",
      name: "Name Specification",
    });

    const specifications_id = [specification.id];

    const specificationCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });

    expect(specificationCars).toHaveProperty("specifications");
    expect(specificationCars.specifications.length).toBe(1);
  });

  it("[CreateCarSpecification] should not be able to add a new specification to a nonexistent car", () => {
    expect(async () => {
      const car_id = "car_id_test";
      const specifications_id = ["specifications_id_test"];

      await createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
