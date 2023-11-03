import AnimalImage from "../database/models/AnimalImage";
import BaseService from "./BaseService";
import database from "../database/database";
import { Transaction } from "sequelize";
import AnimalAttachment from "../database/models/AnimalAttachment";

class AnimalAttachmentService extends BaseService<AnimalAttachment>{
    constructor() {
        super(AnimalAttachment);
    }

    static async DeleteFilesList(filesId: string[], t: Transaction | null = null, commitTransaction: boolean = true) {
        if (!t) {
            t = await database.connection.transaction();
        }
        try {
            if (filesId && filesId.length > 0) {
                for (const id of filesId) {
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

export default AnimalAttachmentService;