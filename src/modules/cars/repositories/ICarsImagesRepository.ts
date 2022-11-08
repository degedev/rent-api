import { CarImages } from "../entities/CarImages";

interface ICarsImagesRepository {
  create(car_id: string, image_name: string): Promise<CarImages>;
}

export { ICarsImagesRepository };
