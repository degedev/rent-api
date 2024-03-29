import { inject, injectable } from "tsyringe";

import { Rental } from "../../entities/Rental";
import { IRentalsRepository } from "../../repositories/IRentalsRepository";

@injectable()
class ListRentalsByUserUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository
  ) {}
  async execute(user_id: string): Promise<Rental[]> {
    const rentalsByUser = await this.rentalsRepository.findRentalsByUserId(
      user_id
    );

    return rentalsByUser;
  }
}

export { ListRentalsByUserUseCase };
