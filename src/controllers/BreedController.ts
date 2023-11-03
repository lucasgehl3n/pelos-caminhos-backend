import { Response, Request } from "express";
import { Op } from "sequelize";
import Breed from "../database/models/Breed";

const _getSearchFilters = (req: Request) => {
    const search = req.query.search || "";
    return {
        where: {
            ...(search && {
                idSpecie: {
                    [Op.eq]: search,
                }
            }),
        },
    }
};


export default class BreedController {
    public static async list(req: Request, res: Response) {
        try {
            const searchFilter = _getSearchFilters(req) as any;
            const entities = await Breed.findAll({
                ...searchFilter,
                limit: 50,
                attributes: ['name', 'idSpecie', 'id'],
            });
            res.status(200).json(entities);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error).send();
        }
    }
}