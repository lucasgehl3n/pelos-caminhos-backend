import BaseService from "./BaseService";
import InstitutionImage from "../database/models/InstitutionImage";

class InstitutionImageService extends BaseService<InstitutionImage>{
    constructor() {
        super(InstitutionImage);
    }
}

export default InstitutionImageService;