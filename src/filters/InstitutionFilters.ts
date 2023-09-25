import { Response, Request } from "express";
import UserRole from "../database/models/UserRole";
import { AuthenticatedRequest } from "../..";
import { Sequelize, Op } from "sequelize";
import { Roles } from "../enums/Roles";

const _bondedFilters = (authenticatedRequest: AuthenticatedRequest, searchFilter: any) => {
    return {
        ...searchFilter,
        include: [
            {
                model: UserRole,
                where: {
                    idUser: authenticatedRequest.user!.id,
                },
            },
        ],
    }
}

const _roleFilters = (authenticatedRequest: AuthenticatedRequest, searchFilter: any, role: string) => {
    const roleId = (role === 'admin') ? Roles.Administrator : Roles.Volunteer;

    return {
        ...searchFilter,
        include: [
            {
                model: UserRole,
                where: {
                    idUser: authenticatedRequest.user!.id,
                    idRole: roleId,
                },
            },
        ],
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
                    {
                        document: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                    {
                        description: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                ]
            })
        },
    }
};

export default class InstitutionFilters {
    static ApplyFilters = (req: Request) => {
        const authenticatedRequest = req as unknown as AuthenticatedRequest;
        const bonded = req.query.bonded || false;
        const searchFilter = _getSearchFilters(req) as any;

        if (bonded) {
            return _bondedFilters(authenticatedRequest, searchFilter);
        }


        const admin = req.query.admin || false;
        const volunteer = req.query.volunteer || false;
        const role = admin ? 'admin' : volunteer ? 'volunteer' : null;
        if (role) {
            return _roleFilters(authenticatedRequest, searchFilter, role);
        }

        return {
            ...searchFilter,
        }
    };
}

