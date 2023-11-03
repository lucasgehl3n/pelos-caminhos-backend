import MedicineAnimal from "../database/models/MedicineAnimal";
import BaseService from "./BaseService";

class MedicineAnimalService extends BaseService<MedicineAnimal>{
    constructor() {
        super(MedicineAnimal);
    }
}

export default MedicineAnimalService;