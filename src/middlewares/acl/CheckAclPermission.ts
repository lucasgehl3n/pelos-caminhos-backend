import { NextFunction } from "express";
import { AuthenticatedRequest } from "../../..";
import { Request, Response } from 'express';
import { Roles } from "../../enums/Roles";

export default function CheckAclPermission(role: Roles) {
    return function (req: Request, res: Response, next: NextFunction) {
        // return next();
        const authenticatedRequest = req as unknown as AuthenticatedRequest;
        const { userRoles } = authenticatedRequest.user!;
        const id = req.params.id || req.body.id;
        if (userRoles.some(x => 
                x.idRole && x.idRole >= role && 
                x.idInstitution?.toString() === id
            )) {
            return next();
        }

        return res.status(401).json({ message: 'Not allowed profile!' });
    }
};

