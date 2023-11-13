import Institution from "../database/models/Institution";
import AdressService from "./AdressService";
import BaseService from "./BaseService";
import database from '../database/database';
import InstitutionImageService from "./InstitutionImageService";
import UserRole from "../database/models/UserRole";
import { Roles } from "../enums/Roles";
import { Op } from "sequelize";

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

            institution = await super.Save(institution, t);
            await t.commit();
            return institution;
        }
        catch (error) {
            await t.rollback();
            console.error('Error occurred during transaction:', error);
        }
    }

    static async CountVolunteers(idUser: number) {
        return await Institution.count({
            include: [
                {
                    model: UserRole,
                    where: {
                        idUser,
                        idRole: Roles.Volunteer
                    },
                },
            ],
        })
    }

    static async CountAdmin(idUser: number) {
        return await Institution.count({
            include: [
                {
                    model: UserRole,
                    where: {
                        idUser,
                        idRole: Roles.Administrator
                    },
                },
            ],
        })
    }
}

export default InstitutionService;