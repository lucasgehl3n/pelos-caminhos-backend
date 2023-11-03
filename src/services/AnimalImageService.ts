import Address from "../database/models/Address";
import AnimalImage from "../database/models/AnimalImage";
import BaseService from "./BaseService";
import database from "../database/database";
import { Transaction } from "sequelize";

class AnimalImageService extends BaseService<AnimalImage>{
    constructor() {
        super(AnimalImage);
    }

    static async DeleteImagesList(imagesId: string[], t: Transaction | null = null, commitTransaction: boolean = true) {
        if (!t) {
            t = await database.connection.transaction();
        }
        try {
            if (imagesId && imagesId.length > 0) {
                for (const id of imagesId) {
                    await super.DeleteById(id, t);
                }

                if (commitTransaction) {
                    await t.commit();
                }
            }
        }
        catch (error) {
            await t.rollback();
            console.error('Error occurred during transaction:', error);
        }
    }
}

export default AnimalImageService;