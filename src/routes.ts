import { Router } from "express";
import passport from "passport";
import { AuthenticatedRequest } from "..";
import { Response, Request } from "express";

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

routes.get('/testingRoute', (req: Request, res: Response) => { 
    const foo = req as unknown as AuthenticatedRequest;
    return res.status(200).send(foo.user?.email);
});

export default routes;