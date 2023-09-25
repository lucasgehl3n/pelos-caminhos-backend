import InterestCity from "../database/models/InterestCity";
import BaseService from "./BaseService";

class CityInterestService extends BaseService<InterestCity>{
    constructor() {
        super(InterestCity);
    }
}

export default CityInterestService;