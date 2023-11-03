import Breed from "../database/models/Breed";
import BaseService from "./BaseService";

class BreedService extends BaseService<Breed>{
    constructor() {
        super(Breed);
    }

    static async getBreedByAITag(tag: string) {
        return await Breed.findOne({
            where: {
                AITag: tag,
            }
        });
    };
}

export default BreedService;