import EntityTemporaryHome from "../database/models/EntityTemporaryHome";
import BaseService from "./BaseService";

class TemporaryHomeService extends BaseService<EntityTemporaryHome>{
    constructor() {
        super(EntityTemporaryHome);
    }
}

export default TemporaryHomeService;