import { Response, Request } from "express";
import UserRole from "../database/models/UserRole";
import { AuthenticatedRequest } from "../..";
import { Op } from "sequelize";
import Institution from "../database/models/Institution";
import AnimalImage from "../database/models/AnimalImage";
import { Species } from "../enums/Species";

const _bondedFilters = (userRoles: UserRole[], searchFilter: any) => {
    return {
        ...searchFilter,
        include: [
            {
                model: Institution,
                as: 'institution',
                where: {
                    id: {
                        [Op.in]: [userRoles.map(ur => ur.idInstitution)]
                    }
                },
            },
            {
                model: AnimalImage,
                as: 'animalImages',
                separate: true, // Isso garantirá que apenas a primeira imagem seja incluída
                limit: 1, // Limita o número de imagens incluídas para cada animal a 1
            },
        ],
    }
}

const _specieFilter = (specie: number, searchFilter: any) => {
    return {
        ...searchFilter,
        where: {
            species: specie
        }
    }
};

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

export default class AnimalFilters {
    static ApplyFilters = (req: Request) => {
        const authenticatedRequest = req as unknown as AuthenticatedRequest;
        const bonded = req.query.bonded || false;
        let searchFilter = _getSearchFilters(req) as any;

        const { userRoles } = (req as unknown as AuthenticatedRequest).user!;

        if (bonded) {
            searchFilter = _bondedFilters(userRoles, searchFilter);
        }


        const specie = req.query.dog ? Species.Dog : req.query.cat ? Species.Cat : null;
        if (specie) {
            searchFilter = _specieFilter(specie, searchFilter);
        }

        return {
            ...searchFilter,
        }
    };
}

