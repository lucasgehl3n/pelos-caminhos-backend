import Address from "../database/models/Address";
import BaseService from "./BaseService";

class AdressService extends BaseService<Address>{
    constructor() {
        super(Address);
    }
}

export default AdressService;