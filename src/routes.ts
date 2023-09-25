import { NextFunction, Router } from "express";
import passport from "passport";
import { AuthenticatedRequest } from "..";
import { Response, Request } from "express";
import CheckUserPermission from "./middlewares/acl/CheckAclPermission";
import { Roles } from "./enums/Roles";
import InstitutionController from "./controllers/InstitutionController";
import multer from "multer";
import CityController from "./controllers/CityController";
import UserController from "./controllers/UserController";
const routes = Router();
routes.post(
    "/login",
    passport.authenticate("local"),
    (req: Request, res: Response) => {
        const reqAuthenticated = req as unknown as AuthenticatedRequest;
        const objectReturn = {
            role: reqAuthenticated.role,
        }
        return res.status(200).send(objectReturn);
    }
);



const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
routes.post('/institution/save',
    upload.any(),
    (req: Request, res: Response) => {
        CheckUserPermission(Roles.User);
        return InstitutionController.save(req, res);
    });

routes.get('/institution/:id', CheckUserPermission(Roles.Administrator), (req, res) => {
    return InstitutionController.detail(req, res);
});

routes.get('/institution/', (req, res) => {
    return InstitutionController.list(req, res);
});

routes.get('/cities/', (req, res) => {
    return CityController.list(req, res);
});

routes.post('/create-account/save', upload.any(), (req, res) => {
    return UserController.save(req, res)
});

export default routes;