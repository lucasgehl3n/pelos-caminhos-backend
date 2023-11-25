import { NextFunction } from "express";
import { AuthenticatedRequest } from "../../..";
import { Request, Response } from 'express';
import { Roles } from "../../enums/Roles";

export default function CheckAclPermission(role: Roles) {
    return function (req: Request, res: Response, next: NextFunction) {
        const authenticatedRequest = req as unknown as AuthenticatedRequest;
        const { userRoles } = authenticatedRequest.user!;
        let id = req.params.id || req.body.id;
        
        if(!req.path.includes('/institution')){
            id = req.params.idInstitution || req.body.idInstitution;
        }

        if (userRoles.some(x => 
                x.idRole && x.idRole >= role && 
                x.idInstitution?.toString() === id
            )) {
            return next();
        }

        return res.status(401).json({ message: 'Not allowed profile!' });
    }
};

