import TreatmentAnimal from "../database/models/TreatmentAnimal";
import BaseService from "./BaseService";

class TreatmentAnimalService extends BaseService<TreatmentAnimal>{
    constructor() {
        super(TreatmentAnimal);
    }
}

export default TreatmentAnimalService;