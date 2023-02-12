import { AppError } from "../../../../errors/AppError";
import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("CreateCar", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it("[CreateCar] should be able to create a new car", async () => {
    const car = await createCarUseCase.execute({
      name: "Name Car",
      description: "Descripton Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand car",
      category_id: "category",
    });

    expect(car).toHaveProperty("id");
  });

  it("[CreateCar] should not be able to create a new car if license plate already exists", async () => {
    await createCarUseCase.execute({
      name: "Car1",
      description: "Descripton Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand car",
      category_id: "category",
    });
    await expect(
      createCarUseCase.execute({
        name: "Car2",
        description: "Descripton Car",
        daily_rate: 100,
        license_plate: "ABC-1234",
        fine_amount: 60,
        brand: "Brand car",
        category_id: "category",
      })
    ).rejects.toEqual(new AppError("Car already exists"));
  });

  it("[CreateCar] should be able to create a new car with available true by default", async () => {
    const car = await createCarUseCase.execute({
      name: "Car Available",
      description: "Descripton Car",
      daily_rate: 100,
      license_plate: "DEF-1234",
      fine_amount: 60,
      brand: "Brand car",
      category_id: "category",
    });

    expect(car.available).toBe(true);
  });
});
