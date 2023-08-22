import Institution from "../database/models/Institution";
import InstitutionService from "../services/InstitutionService";
import { Response, Request } from "express";

const _mapRequestToData = (req: Request) => {
    const data = req.body as unknown as Institution;
    if (req.file && req.file.size > 0) {
        data.image = req.file?.buffer.toString('base64');
    }
    else {
        data.image = null;
    }

    data.adress = JSON.parse(req.body.adress);
    return data;
};

const _mapInstitutionImage = (entity: Institution) => {
    if (entity.image) {
        const image = Buffer.from(entity.image, 'base64').toString('ascii');
        if (image) {
            entity.image = `data:image/png;base64,${image}`;
        }
    }
    return entity;
};

class InstitutionController {
    public static async save(req: Request, res: Response) {
        const data = _mapRequestToData(req);
        InstitutionService.SaveWithDependences(data);
        return res.status(200).send({});
    }

    public static async detail(req: Request, res: Response) {
        try {
            let entity = await Institution.findByPk(req.params.id, {
                include: [
                    'address',
                ],
            });

            if (entity) {
                entity = _mapInstitutionImage(entity);
                return res.status(200).json(entity);
            }
            return res.status(404).json({});
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error).send();
        }
    }
}

export default InstitutionController;