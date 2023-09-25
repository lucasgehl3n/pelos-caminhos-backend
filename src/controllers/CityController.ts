import { Response, Request } from "express";
import { Op } from "sequelize";
import City from "../database/models/City";
import State from "../database/models/State";

const _getSearchFilters = (req: Request) => {
    const search = req.query.search || "";
    return {
        where: {
            ...(search && {
                [Op.or]: [
                    {
                        name: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                ]
            })
        },
    }
};


export default class CityController {
    public static async list(req: Request, res: Response) {
        try {
            const searchFilter = _getSearchFilters(req) as any;
            const cities = await City.findAll({
                ...searchFilter,
                limit: 50,
                attributes: ['name', 'id'],
                include: [
                    {
                        model: State,
                        as: 'state',
                        attributes: ['short_name'],
                    },
                ],
            });
            res.status(200).json(cities);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error).send();
        }
    }
}