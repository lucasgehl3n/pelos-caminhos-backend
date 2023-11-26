import { AuthenticatedRequest } from "../..";
import { Response, Request } from "express";
import AnimalService from "../services/AnimalService";
import Animal from "../database/models/Animal";
import moment from "moment";
import AnimalImage from "../database/models/AnimalImage";
import database from "../database/database";
import AnimalImageService from "../services/AnimalImageService";
import AnimalAttachment from "../database/models/AnimalAttachment";
import AnimalAttachmentService from "../services/AnimalAttachmentService";
import Constants from "../../constants";
import AnimalFilters from "../filters/AnimalFilters";
import AnimalPredictionService from "../services/AnimalPredictionService";
import { Species } from "../enums/Species";
import Breed from "../database/models/Breed";
import Institution from "../database/models/Institution";
import User from "../database/models/User";
import Color from "../database/models/Color";
import BehavioralProfile from "../database/models/BehavioralProfile";
import UserRole from "../database/models/UserRole";
import { Roles } from "../enums/Roles";
import sharp from "sharp";
const _mapRequestToData = async (req: Request) => {
    let data = req.body as unknown as Animal;
    data = mapData(data);
    return data;
}

const mapData = (data: any) => {
    if (data.collectionDate) {
        data.collectionDate = moment(data.collectionDate, 'DD/MM/YYYY').toString();
    }

    if (data.adoptionDate)
        data.adoptionDate = moment(data.adoptionDate, 'DD/MM/YYYY').toString();

    if (data.forwardingDate)
        data.forwardingDate = moment(data.forwardingDate, 'DD/MM/YYYY').toString();

    if (data.deathDate)
        data.deathDate = moment(data.deathDate, 'DD/MM/YYYY').toString();

    if (data.medicineAnimal && data.medicineAnimal.length > 0) {
        for (const medicine of data.medicineAnimal) {
            if (medicine.application_date)
                medicine.application_date = moment(medicine.application_date, 'DD/MM/YYYY').toString();

            if (medicine.endDate)
                medicine.endDate = moment(medicine.endDate, 'DD/MM/YYYY').toString();

            if (medicine.initialDate)
                medicine.initialDate = moment(medicine.initialDate, 'DD/MM/YYYY').toString();
        }
    }

    if (data.treatment && data.treatment.length > 0) {
        for (const treatment of data.treatment) {
            if (treatment.endForecastDate)
                treatment.endForecastDate = moment(treatment.endForecastDate, 'DD/MM/YYYY').toString();

            if (treatment.endDate)
                treatment.endDate = moment(treatment.endDate, 'DD/MM/YYYY').toString();

            if (treatment.initialDate)
                treatment.initialDate = moment(treatment.initialDate, 'DD/MM/YYYY').toString();
        }
    }

    return data;
}

const compressImage = async (imageBuffer: Buffer): Promise<Buffer> => {
    return await sharp(imageBuffer)
        .jpeg({ quality: 70 })
        .png({ quality: 70 })
        .toBuffer();
};

const _mapGalleryToData = async (req: Request, images: Record<string, any>) => {
    const animalImages = images.filter(
        (file: Express.Multer.File) =>
            file.fieldname.includes('animalImages')
    );

    let imagesConfig = [];
    let idAnimal = req.body.id;
    for (let i = 0; i < animalImages.length; i++) {
        const imageObject = new AnimalImage();
        const id = req.body[`animalImages[${i}].id`]
        imageObject.id = id != 0 ? id : null;
        imageObject.idAnimal = idAnimal;

        const compressedBuffer = await compressImage(animalImages[i].buffer);
        imageObject.image = compressedBuffer;

        imagesConfig.push(imageObject);
        const originalname = animalImages[i].originalname;
        const fileExtension = originalname.split('.').pop();
        imageObject.type = fileExtension;
    }

    return imagesConfig;
}

const _mapAnimalAttachmentToData = (req: Request, images: Record<string, any>) => {
    const animalAttachments = images.filter(
        (file: Express.Multer.File) =>
            file.fieldname.includes('animalAttachments')
    );

    let filesConfig = [];
    let idAnimal = req.body.id;
    for (let i = 0; i < animalAttachments.length; i++) {
        const fileObject = new AnimalAttachment();
        const id = req.body[`animalAttachments[${i}].id`]
        fileObject.id = id != 0 ? id : null;
        fileObject.idAnimal = idAnimal;
        fileObject.type = req.body[`animalAttachments[${i}].type`];
        fileObject.description = req.body[`animalAttachments[${i}].description`];
        fileObject.file = animalAttachments[i].buffer;
        filesConfig.push(fileObject);
    }

    return filesConfig;
}

const _mapAnimalImages = async (entity: Animal) => {
    if (entity.animalImages) {
        await entity.animalImages.forEach(async (image: AnimalImage) => {
            if (image.image) {
                const imageBase64 = await Buffer.from(image.image).toString('base64');
                if (imageBase64) {
                    image.image = `data:image/png;base64,${imageBase64}`;
                }
            }
        });
    }
    return entity;
};

const _mapAnimalFiles = async (entity: Animal) => {
    if (entity.animalAttachments) {
        await entity.animalAttachments.forEach(async (file: AnimalAttachment) => {
            if (file.file) {
                const buffer = Buffer.from(file.file).toString('base64');
                if (buffer) {
                    file.file = `data:application/pdf;base64,${buffer}`;
                }
            }
        });
    }
    return entity;
};


const _mapRolesSearch = async (entityView: Animal, userRoles: any, animalViewList: Object[]) => {
    if (userRoles.some((x: UserRole) =>
        x.idInstitution == entityView.idInstitution,
    )) {
        const role = userRoles.find((x: UserRole) =>
            x.idInstitution == entityView.idInstitution,
        );

        animalViewList.push({ ...entityView.dataValues, role: role?.idRole as Roles });
    }
    else {
        animalViewList.push(entityView);
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

export default class AnimalController {
    public static async save(req: Request, res: Response) {
        try {
            const data = await _mapRequestToData(req);
            const animal = await AnimalService.SaveWithDependences(data);
            return res.status(200).send({ id: animal?.id });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error).send();
        }
    }

    public static async validateRoles(req: Request, animal: Animal | null = null) {
        const deletedImages = req.body.deletedImages as string[];

        const { userRoles } = (req as unknown as AuthenticatedRequest).user!;
        const searchedInstitution = animal?.idInstitution || "";
        if (!userRoles || !userRoles.some(x =>
            x.idInstitution === searchedInstitution
        )) {
            return false;
        }

        if (deletedImages && deletedImages.length > 0) {
            for (const idImage of deletedImages) {
                const imageCurrent = await AnimalImage.findByPk(idImage, { include: ['animal'] });
                //If some role has permission to change the institution
                if (!userRoles.some(x =>
                    x.idInstitution === imageCurrent?.animal.idInstitution
                )) {
                    return false;
                }
            }
        }

        const deletedFiles = req.body.deletedAnimalAttachments as string[];
        if (deletedFiles && deletedFiles.length > 0) {
            for (const idFile of deletedFiles) {
                const fileCurrent = await AnimalAttachment.findByPk(idFile, { include: ['animal'] });
                //If some role has permission to change the institution
                if (!userRoles.some(x =>
                    x.idInstitution === fileCurrent?.animal.idInstitution
                )) {
                    return false;
                }
            }
        }
        return true;
    }


    public static async saveFiles(req: Request, res: Response) {
        const animal = await Animal.findByPk(req.body.id);
        try {
            const transaction = await database.connection.transaction();
            if (animal) {
                if (!this.validateRoles(req, animal)) {
                    return res.status(403).send();
                }

                const deletedImages = req.body.deletedImages as string[];
                const deletedFiles = req.body.deletedAnimalAttachments as string[];
                await AnimalImageService.DeleteImagesList(deletedImages, transaction, false);
                await AnimalAttachmentService.DeleteFilesList(deletedFiles, transaction, false);

                const images = (req.files as Record<string, any>);
                if (images && images.length > 0) {
                    animal.animalImages = await _mapGalleryToData(req, images);
                    animal.animalAttachments = _mapAnimalAttachmentToData(req, images);
                }

                const animalSaved = await AnimalService.SaveWithDependences(animal, transaction);
                if (animalSaved?.id || animalSaved?.id === 0) {
                    if (animal.animalImages && animal.animalImages.length > 0) {
                        if (animal.species == Species.Dog) {
                            let i = 0;
                            const listImages = [];
                            for (const image of animal.animalImages) {
                                if (i > 10)
                                    break;
                                const buffer = Buffer.from(image.image);
                                const blob = new Blob([buffer], { type: image.type });
                                listImages.push(blob);
                                i++;
                            }
                            AnimalPredictionService
                                .generateAnimalPrediction(listImages, animal.id);
                        }
                    }
                }
            }
            return res.status(200).send({
                id: animal?.id
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error).send();
        }
    }

    public static async detail(req: Request, res: Response) {
        try {
            let entity = await Animal.findByPk(req.params.id, {
                include: [
                    'adoptionUser',
                    'temporaryHome',
                    'medicineAnimal',
                    'animalImages',
                    'treatment',
                    'animalAttachments'
                ],
            });

            if (entity) {
                entity = await _mapAnimalImages(entity);
                entity = await _mapAnimalFiles(entity);
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

            let entities = await Animal.findAll({
                include: [
                    {
                        model: AnimalImage,
                        as: 'animalImages',
                        separate: true,
                        limit: 1,
                    },
                    {
                        model: Institution,
                        as: 'institution',
                        attributes: ['name'],
                    },
                ],
                ...AnimalFilters.ApplyFilters(req),
                offset: offset,
                attributes: ['id', 'name', 'age', 'gender', 'size', 'idInstitution'],
                limit: Constants.resultsPerPage,
                order: sortingCriteria,
            });

            if (entities) {
                const authenticatedRequest = req as unknown as AuthenticatedRequest;
                const { userRoles } = authenticatedRequest.user!;

                const viewList: Object[] = [];
                for (let i = 0; i < entities.length; i++) {
                    if (entities[i].animalImages && entities[i].animalImages.length > 0) {
                        entities[i].animalImages = [entities[i].animalImages[0]];
                        entities[i] = await _mapAnimalImages(entities[i]);
                    }
                    const entityView = entities[i];
                    _mapRolesSearch(entityView, userRoles, viewList);
                }

                return res.status(200).json({
                    list: [
                        ...viewList,
                    ],
                });
            }

            return res.status(404).json();
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error).send();
        }
    }


    public static async PredictionImage(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Nenhuma imagem foi enviada. Certifique-se de incluir um campo chamado "image" com o arquivo.' });
            }

            const image = req.file;
            const blob = new Blob([image.buffer], { type: image.mimetype });

            const filters = req.body.filters;
            const page = req.body.page;

            const prediction = await AnimalPredictionService.getAnimalPredictionsOnSearch(blob);
            if (prediction) {
                for (const entities of prediction) {
                    const institutionViewList: Object[] = [];
                    for (let i = 0; i < entities.animalList.length; i++) {
                        if (entities.animalList[i].animalImages && entities.animalList[i].animalImages.length > 0) {
                            entities.animalList[i].animalImages = [entities.animalList[i].animalImages[0]];
                            entities.animalList[i] = await _mapAnimalImages(entities.animalList[i]);
                        }
                        institutionViewList.push(entities.animalList[i])
                    }
                }
            }
            return res.status(200).json(prediction);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error).send();
        }
    }

    public static async publicDetail(req: Request, res: Response) {
        try {
            let entity = await Animal.findByPk(req.params.id, {
                include: [
                    'animalImages',
                    {
                        model: Breed,
                        as: 'breed',
                        attributes: ['name']
                    },
                    {
                        model: Institution,
                        as: 'institution',
                        attributes: ['name']
                    },
                    {
                        model: User,
                        as: 'adoptionUser',
                        attributes: ['name']
                    },
                    {
                        model: Color,
                        as: 'color',
                        attributes: ['name', 'class']
                    },
                    {
                        model: BehavioralProfile,
                        as: 'behavioralProfile',
                        attributes: ['name']
                    }
                ],
                attributes: {
                    exclude: [
                        'collectionPlace',
                        'deathDate',
                        'deathDetail',
                        'adoptionSolictationDate',
                        'forwardingDate',
                    ]
                }
            });

            if (entity) {
                entity = await _mapAnimalImages(entity);
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