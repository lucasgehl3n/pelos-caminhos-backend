import { Response, Request } from "express";
import Color from "../database/models/Color";

export default class ColorController {
    public static async list(req: Request, res: Response) {
        try {
         
            const entities = await Color.findAll({
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