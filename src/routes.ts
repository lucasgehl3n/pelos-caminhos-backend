import { Router } from "express";
import passport from "passport";
import { AuthenticatedRequest } from "..";
import { Response, Request } from "express";
import CheckUserPermission from "./middlewares/acl/CheckAclPermission";
import { Roles } from "./enums/Roles";

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

routes.get('/testingRoute', CheckUserPermission(Roles.User), (req, res) => {
    res.json({ message: 'Usuário encontrado!' });
  });
  
export default routes;