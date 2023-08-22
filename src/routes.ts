import { Router } from "express";
import passport from "passport";
import { AuthenticatedRequest } from "..";
import { Response, Request } from "express";
import CheckUserPermission from "./middlewares/acl/CheckAclPermission";
import { Roles } from "./enums/Roles";
import InstitutionController from "./controllers/InstitutionController";
import multer from "multer";

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


const storage = multer.memoryStorage();
const upload = multer({ storage });

routes.post('/institution/save',
    [
        upload.single('logo'),
    ],
    (req: Request, res: Response) => {
        CheckUserPermission(Roles.User);
        return InstitutionController.save(req, res);
    });

routes.get('/institution/:id', CheckUserPermission(Roles.Administrator), (req, res) => {
    return InstitutionController.detail(req, res);
});

export default routes;