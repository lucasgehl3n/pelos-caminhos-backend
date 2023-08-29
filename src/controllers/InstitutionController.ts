import { AuthenticatedRequest } from "../..";
import Address from "../database/models/Address";
import Institution from "../database/models/Institution";
import InstitutionImage from "../database/models/InstitutionImage";
import { Response, Request } from "express";
import InstitutionService from "../services/InstitutionService";
import UserRoleService from "../services/UserRoleService";
import InstitutionImageService from "../services/InstitutionImageService";

const _mapGalleryToData = (req: Request, images: Record<string, any>) => {
    const publicImages = images.filter(
        (file: Express.Multer.File) =>
            file.fieldname.includes('publicImages')
    );

    let imagesConfig = [];
    for (let i = 0; i < publicImages.length; i++) {
        const imageObject = new InstitutionImage();
        const id = req.body[`publicImages[${i}].id`]
        imageObject.id = id != 0 ? id : null;
        const image = publicImages[i].buffer;
        imageObject.image = image.toString('base64');
        imagesConfig.push(imageObject);
    }

    return imagesConfig;
}

const _mapRequestToData = async (req: Request) => {
    const data = req.body as unknown as Institution;
    const images = (req.files as Record<string, any>);
    const imagesConfig = _mapGalleryToData(req, images);

    data.publicImages = [...imagesConfig];
    data.adress = req.body.address as Address;


    const logoImage = images.find(
        (file: Express.Multer.File) =>
            file.fieldname == 'logo'
    );

    if (logoImage) {
        data.image = logoImage.buffer?.toString('base64');
    }

    return data;
};

const _mapInstitutionImage = async (entity: Institution) => {
    if (entity.image) {
        const image = await Buffer.from(entity.image, 'base64').toString('ascii');
        if (image) {
            entity.image = `data:image/png;base64,${image}`;
        }
    }

    if (entity.publicImages) {
        await entity.publicImages.forEach(async (image: InstitutionImage) => {
            if (image.image) {
                const imageBase64 = await Buffer.from(image.image, 'base64').toString('ascii');
                if (imageBase64) {
                    image.image = `data:image/png;base64,${imageBase64}`;
                }
            }
        });
    }
    return entity;
};

const _deletePublicImages = async (req: Request, res: Response) => {
    const getDeletedImages: number[] = req.body.deletedPublicImages;
    const authenticatedRequest = req as unknown as AuthenticatedRequest;
    const { userRoles } = authenticatedRequest.user!;

    if (getDeletedImages) {
        let i = 0;
        for (i = 0; i < getDeletedImages.length; i++) {
            const idImage = getDeletedImages[i].toString();
            const image = await InstitutionImageService.GetById(idImage);

            //If some role has permission to change the institution
            if (userRoles.some(x =>
                x.idInstitution?.toString() == image?.idInstitution
            )) {
                await InstitutionImageService.DeleteById(idImage);
            }
            else {
                res.sendStatus(401);
            }
        };
    }
};
class InstitutionController {
    public static async save(req: Request, res: Response) {
        await _deletePublicImages(req, res);
        const data = await _mapRequestToData(req);
        const authenticatedRequest = req as unknown as AuthenticatedRequest;
        const shouldGenerateUserService = !data.id;

        await InstitutionService.SaveWithDependences(data);

        if (shouldGenerateUserService) {
            UserRoleService.GenerateUserServiceToInstitution(authenticatedRequest.user!, data);
        }

        return res.status(200).send({});
    }

    public static async detail(req: Request, res: Response) {
        try {
            let entity = await Institution.findByPk(req.params.id, {
                include: [
                    'address',
                    'publicImages',
                ],
            });

            if (entity) {
                entity = await _mapInstitutionImage(entity);
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