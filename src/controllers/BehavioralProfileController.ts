import { Response, Request } from "express";
import BehavioralProfile from "../database/models/BehavioralProfile";
export default class BehavioralProfileController {
    public static async list(req: Request, res: Response) {
        try {
         
            const entities = await BehavioralProfile.findAll({
                limit: 50,
            });
            res.status(200).json(entities);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error).send();
        }
    }
}