import { Response, Request } from "express";
import { Op } from "sequelize";
import EntityTemporaryHome from "../database/models/EntityTemporaryHome";
import { AuthenticatedRequest } from "../..";
import TemporaryHomeService from "../services/TemporaryHomeService";

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
                    {
                        details: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                ],
            }),
            [Op.and]: [
                {
                    idInstitution: {
                        [Op.eq]: req.query.idInstitution,
                    }
                }
            ],
        },
    }
};


const _mapRequestToData = async (req: Request) => {
    const data = req.body as unknown as EntityTemporaryHome; 
    return data;
}

export default class EntityTemporaryHomeController {
    public static async validateRoles(req: Request, temporaryHome: EntityTemporaryHome | null = null) {
        const { userRoles } = (req as unknown as AuthenticatedRequest).user!;
        const searchedInstitution = temporaryHome?.idInstitution || "";
        if (!userRoles || !userRoles.some(x =>
            x.idInstitution === searchedInstitution
        )) {
            return false;
        }
    }

    public static async list(req: Request, res: Response) {
        try {
            const { userRoles } = (req as unknown as AuthenticatedRequest).user!;
            const searchedInstitution = req.query.idInstitution || "";
            if (!userRoles || !userRoles.some(x =>
                x.idInstitution?.toString() === searchedInstitution
            )) {
                return res.status(403).send();
            }
            const searchFilter = _getSearchFilters(req) as any;
            const entities = await EntityTemporaryHome.findAll({
                ...searchFilter,
                limit: 50,
                attributes: ['name', 'details', 'id'],
            });
            res.status(200).json(entities);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error).send();
        }
    }
    public static async save(req: Request, res: Response) {
        try {
            const mapModel = await _mapRequestToData(req);
            if (!this.validateRoles(req, mapModel)) {
                return res.status(403).send();
            }
            const { name, details, id} = await TemporaryHomeService.Save(mapModel);
            return res.status(200).send({ name, details, id });
        } catch (error) {
            console.error(error);
            return res.status(500).json(error).send();
        }
    }
}