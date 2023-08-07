import { NextFunction } from "express";
import { AuthenticatedRequest } from "../../..";
import { Request, Response } from 'express';
import { Roles } from "../../enums/Roles";

export default function CheckAclPermission(role: Roles) {
    return function (req: Request, res: Response, next: NextFunction) {
        const authenticatedRequest = req as unknown as AuthenticatedRequest;
        const { userRoles } = authenticatedRequest.user!;

        if (userRoles.some(x => x.idRole === role)) {
            return next();
        }

        return res.status(403).json({ message: 'Perfil sem permissão!' });
    }
};

