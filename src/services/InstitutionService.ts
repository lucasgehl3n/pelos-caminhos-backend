import Institution from "../database/models/Institution";
import AdressService from "./AdressService";
import BaseService from "./BaseService";
import database from '../database/database';
import InstitutionImageService from "./InstitutionImageService";

class InstitutionService extends BaseService<Institution>{
    constructor() {
        super(Institution);
    }

    static async SaveWithDependences(institution: Institution) {
        const t = await database.connection.transaction();
        try {
            if (institution.adress) {
                const address = await AdressService.Save(institution.adress, t);
                institution.idAddress = address?.id;
            }

            if (institution.publicImages) {
                for (const image of institution.publicImages) {
                    image.idInstitution = institution.id;
                    await InstitutionImageService.Save(image, t);
                }
            }

            await super.Save(institution, t);
            await t.commit();
        }
        catch (error) {
            await t.rollback();
            console.error('Error occurred during transaction:', error);
        }
    }
}

export default InstitutionService;