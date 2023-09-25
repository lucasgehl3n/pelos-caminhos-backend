import Interest from "../database/models/Interest";
import BaseService from "./BaseService";

class InterestService extends BaseService<Interest>{
    constructor() {
        super(Interest);
    }
}

export default InterestService;