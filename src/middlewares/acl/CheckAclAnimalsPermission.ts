import { NextFunction } from "express";
import { AuthenticatedRequest } from "../../..";
import { Request, Response } from 'express';
import { Roles } from "../../enums/Roles";
import Animal from "../../database/models/Animal";

export default function CheckAclAnimalsPermission(role: Roles) {
    return async function (req: Request, res: Response, next: NextFunction) {
        const authenticatedRequest = req as unknown as AuthenticatedRequest;
        const { userRoles } = authenticatedRequest.user!;
        const id = req.params.id || req.body.id;
    
        const animal = await Animal.findByPk(id);
        if (userRoles.some(x => 
                x.idRole && x.idRole >= role && 
                x.idInstitution === animal?.idInstitution
            )) {
            return next();
        }

        return res.status(401).json({ message: 'Not allowed profile!' });
    }
};

