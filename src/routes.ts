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
import EntityTemporaryHomeController from "./controllers/EntityTemporaryHomeController";
import BreedController from "./controllers/BreedController";
import ColorController from "./controllers/ColorController";
import BehavioralProfileController from "./controllers/BehavioralProfileController";
import AnimalController from "./controllers/AnimalController";
const routes = Router();

const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
}

routes.use(globalErrorHandler);

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

routes.get('/public/institution/:id', (req, res) => {
    return InstitutionController.publicDetail(req, res);
});

routes.get('/institution/', (req, res) => {
    return InstitutionController.list(req, res);
});

routes.get('/roles', (req, res) => {
    return InstitutionController.ListInstitutionsWithRoles(req, res);
});

routes.get('/cities/', (req, res) => {
    return CityController.list(req, res);
});

routes.get('/temporaryHome/', (req, res) => {
    return EntityTemporaryHomeController.list(req, res);
});

routes.get('/breed/', (req, res) => {
    return BreedController.list(req, res);
});

routes.post('/create-account/save', upload.any(), (req, res) => {
    return UserController.save(req, res)
});

routes.get('/user/', (req, res) => {
    return UserController.list(req, res)
});

routes.get('/colors', (req, res) => {
    return ColorController.list(req, res)
});

routes.get('/behavioralProfile', (req, res) => {
    return BehavioralProfileController.list(req, res)
});

routes.post('/animal/save', upload.any(), (req, res) => {
    return AnimalController.save(req, res)
});

routes.post('/animal/saveFiles', upload.any(), (req, res) => {
    return AnimalController.saveFiles(req, res)
});

routes.post('/temporaryHome/save', (req, res) => {
    return EntityTemporaryHomeController.save(req, res)
});

routes.get('/animal/:id', (req, res) => {
    return AnimalController.detail(req, res)
});

routes.get('/animal/', (req, res) => {
    return AnimalController.list(req, res)
});


routes.post('/animal/prediction', upload.single('image'), (req, res) => {
    return AnimalController.PredictionImage(req, res)
});


export default routes;