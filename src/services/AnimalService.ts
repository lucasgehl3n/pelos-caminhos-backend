import { Transaction } from "sequelize";
import database from "../database/database";
import Animal from "../database/models/Animal";
import AnimalImageService from "./AnimalImageService";
import BaseService from "./BaseService";
import MedicineAnimalService from "./MedicineAnimalService";
import TreatmentAnimalService from "./TreatmentAnimalService";
import AnimalAttachmentService from "./AnimalAttachmentService";

class AnimalService extends BaseService<Animal>{
    constructor() {
        super(Animal);
    }

    static async SaveWithDependences(animal: Animal, t: Transaction | null = null) {
        if (!t)
            t = await database.connection.transaction();

        try {
            if (animal.medicineAnimal) {
                for (const medicine of animal.medicineAnimal) {
                    medicine.idAnimal = animal.id;
                    await MedicineAnimalService.Save(medicine, t);
                }
            }

            if (animal.treatment) {
                for (const treatment of animal.treatment) {
                    treatment.idAnimal = animal.id;
                    await TreatmentAnimalService.Save(treatment, t);
                }
            }

            let images = [];
            if (animal.animalImages) {
                for (const image of animal.animalImages) {
                    image.idAnimal = animal.id;
                    images.push(await AnimalImageService.Save(image, t));
                }
            }

            if (animal.animalAttachments) {
                for (const file of animal.animalAttachments) {
                    file.idAnimal = animal.id;
                    await AnimalAttachmentService.Save(file, t);
                }
            }

            animal = await super.Save(animal, t);
            await t.commit();
            animal.animalImages = images;
            return animal;
        }
        catch (error) {
            await t.rollback();
            console.error('Error occurred during transaction:', error);
        }
    }

    static async GetAnimalByBreed(idBreed: number) {
        return await Animal.findAll({
            where: {
                idBreed
            }
        });
    }
}

export default AnimalService;