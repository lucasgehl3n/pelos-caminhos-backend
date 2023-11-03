import { AuthenticatedRequest } from "../..";
import Address from "../database/models/Address";
import Institution from "../database/models/Institution";
import InstitutionImage from "../database/models/InstitutionImage";
import { Response, Request } from "express";
import InstitutionService from "../services/InstitutionService";
import UserRoleService from "../services/UserRoleService";
import InstitutionImageService from "../services/InstitutionImageService";
import Constants from "../../constants";
import { Roles } from "../enums/Roles";
import UserRole from "../database/models/UserRole";
import InstitutionFilters from "../filters/InstitutionFilters";
import { Op } from "sequelize";

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

    if (!data.id) {
        const authenticatedRequest = req as unknown as AuthenticatedRequest;
        data.idUserCreator = authenticatedRequest.user!.id;
    }

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
    return entity;
};

const _mapPublicImages = async (entity: Institution) => {
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

const _mapRolesSearch = async (entityView: Institution, userRoles: any, institutionViewList: Object[]) => {
    if (userRoles.some((x: UserRole) =>
        x.idInstitution == entityView.id,
    )) {
        const role = userRoles.find((x: UserRole) =>
            x.idInstitution == entityView.id,
        );

        institutionViewList.push({ ...entityView.dataValues, role: role?.idRole as Roles });
    }
    else {
        institutionViewList.push(entityView);
    }
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


interface SortingOptions {
    'name-az': string[][];
    'name-za': string[][];
    'latest': string[][];
    'old': string[][];
}

const sortingOptions: SortingOptions = {
    'name-az': [['name', 'ASC']],
    'name-za': [['name', 'DESC']],
    'latest': [['createdAt', 'DESC']],
    'old': [['createdAt', 'ASC']],
};

class InstitutionController {
    public static async save(req: Request, res: Response) {
        try {
            await _deletePublicImages(req, res);
            const data = await _mapRequestToData(req);
            const authenticatedRequest = req as unknown as AuthenticatedRequest;
            const shouldGenerateUserService = !data.id;

            const institution = await InstitutionService.SaveWithDependences(data);
            if (shouldGenerateUserService) {
                UserRoleService.GenerateUserServiceToInstitution(authenticatedRequest.user!, data);
            }

            return res.status(200).send({ id: institution?.id});
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error).send();
        }
    }

    public static async publicDetail(req: Request, res: Response) {
        try {
            let entity = await Institution.findByPk(req.params.id, {
                include: [
                    'address',
                    'publicImages',
                ],
                attributes: {
                    exclude: [
                        'receive_volunteers',
                        'idAddress',
                        'document',
                        'idUserCreator'
                    ]
                }
            });

            if (entity) {
                entity = await _mapInstitutionImage(entity);
                entity = await _mapPublicImages(entity);
                return res.status(200).json(entity);
            }

            return res.status(404).json({});
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error).send();
        }
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
                entity = await _mapPublicImages(entity);
                return res.status(200).json(entity);
            }

            return res.status(404).json({});
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error).send();
        }
    }

    public static async list(req: Request, res: Response) {
        try {
            const currentPage = req.query.page ? parseInt(req.query.page as string) : 0;
            const offset = (currentPage - 1)
                * Constants.resultsPerPage;


            const sortingKey: keyof SortingOptions =
                req.query.sorting as keyof SortingOptions;

            const sortingCriteria = sortingOptions[sortingKey] || sortingOptions['name-az'];;

            let entities = await Institution.findAll({
                ...InstitutionFilters.ApplyFilters(req),
                offset: offset,
                limit: Constants.resultsPerPage,
                order: sortingCriteria,
            });

            const authenticatedRequest = req as unknown as AuthenticatedRequest;
            const { userRoles } = authenticatedRequest.user!;

            if (entities) {
                const institutionViewList: Object[] = [];
                for (let i = 0; i < entities.length; i++) {
                    entities[i] = await _mapInstitutionImage(entities[i]);
                    const entityView = entities[i];
                    _mapRolesSearch(entityView, userRoles, institutionViewList);
                }

                const userId = authenticatedRequest.user!.id;
                const countVolunteer = await InstitutionService.CountVolunteers(userId!);
                const countAdmin = await InstitutionService.CountAdmin(userId!);
                return res.status(200).json({
                    list: [
                        ...institutionViewList,
                    ],
                    counters: {
                        volunteer: countVolunteer,
                        admin: countAdmin,
                        bounded: (countVolunteer || 0) + (countAdmin || 0),
                    }
                });
            }

            return res.status(404).json();
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error).send();
        }
    }

    public static async ListInstitutionsWithRoles(req: Request, res: Response) {
        const authenticatedRequest = req as unknown as AuthenticatedRequest;
        const { userRoles } = authenticatedRequest.user!;
        let roles = userRoles.filter((x: UserRole) =>
            x.idRole == Roles.Administrator || x.idRole == Roles.Volunteer
        );

        let listInstitutions = [];
        for (let i = 0; i < roles.length; i++) {
            listInstitutions.push(roles[i].idInstitution);
        }

        const institutions = await Institution.findAll({
            where: {
                id: {
                    [Op.in]: listInstitutions,
                },

            },
            attributes: ['id', 'name', 'image'],
        });

        for (let i = 0; i < institutions.length; i++) {
            institutions[i] = await _mapInstitutionImage(institutions[i]);
        }

        return res.status(200).json(institutions);
    }
}

export default InstitutionController;