import dayjs from "dayjs";

import { AppError } from "../../../../errors/AppError";
import { DayJsDateProvider } from "../../../../shared/container/providers/DateProvider/implementations/DayJsDateProvider";
import { CarsRepositoryInMemory } from "../../../cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "../../repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayJsDateProvider: DayJsDateProvider;

describe("CreateRental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dayJsDateProvider = new DayJsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayJsDateProvider,
      carsRepositoryInMemory
    );
  });

  it("[CreateRental] should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Sample Car Name",
      description: "Sample Car Description",
      brand: "Sample Car Brand",
      license_plate: "Sample Car License Plate",
      category_id: "Sample Car Category ID",
      daily_rate: 100,
      fine_amount: 40,
    });

    const rental = await createRentalUseCase.execute({
      user_id: "user_id",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("[CreateRental] should not be able to create a new rental if user has any other open rental", async () => {
    await rentalsRepositoryInMemory.create({
      car_id: "car_id_1",
      expected_return_date: dayAdd24Hours,
      user_id: "user_id_test",
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "user_id_test",
        car_id: "car_id_2",
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("User has a rental in progress"));
  });

  it("[CreateRental] should not be able to create a new rental if car is in any other open rental", async () => {
    await rentalsRepositoryInMemory.create({
      car_id: "car_id_test",
      expected_return_date: dayAdd24Hours,
      user_id: "user_id_1",
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "user_id_2",
        car_id: "car_id_test",
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("Car is unavailable"));
  });

  it("[CreateRental] should not be able to create a new rental with invalid return time", async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: "user_id",
        car_id: "car_id",
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new AppError("User has a rental in progress"));
  });
});
