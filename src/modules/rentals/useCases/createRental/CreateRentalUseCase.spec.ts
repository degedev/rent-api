import { AppError } from "./../../../../errors/AppError";
import { RentalsRepositoryInMemory } from "../../repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./CreateRentalUseCase";
import { DayJsDateProvider } from "../../../../shared/container/providers/DateProvider/implementations/DayJsDateProvider";
import dayjs from "dayjs";
import { CarsRepositoryInMemory } from "../../../cars/repositories/in-memory/CarsRepositoryInMemory";

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
    const rental = await createRentalUseCase.execute({
      user_id: "user_id",
      car_id: "car_id",
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("[CreateRental] should not be able to create a new rental if user has any other open rental", () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "user_id_test",
        car_id: "car_id_1",
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        user_id: "user_id_test",
        car_id: "car_id_2",
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("[CreateRental] should not be able to create a new rental if car is in any other open rental", () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "user_id_1",
        car_id: "car_id_test",
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        user_id: "user_id_2",
        car_id: "car_id_test",
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("[CreateRental] should not be able to create a new rental with invalid return time", () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "user_id",
        car_id: "car_id",
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
