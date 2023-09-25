import City from "../database/models/City";
import BaseService from "./BaseService";

class CityService extends BaseService<City>{
    constructor() {
        super(City);
    }
}

export default CityService;