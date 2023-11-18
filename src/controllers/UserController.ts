import { Request, Response } from 'express';
import InterestCity from '../database/models/InterestCity';
import User from '../database/models/User';
import Address from '../database/models/Address';
import UserService from '../services/UserService';
import BCrypt from 'bcryptjs';
import moment from 'moment';
import Interest from '../database/models/Interest';
import { Op } from 'sequelize';
import { AuthenticatedRequest } from '../..';
const _mapCitiesToData = (req: Request) => {
    const formData = req.body;

    const cityIndexes = Object.keys(formData).filter(key => key.match(/^cities\[\d+\]\.id$/));

    const citiesArray = cityIndexes.map(indexKey => {
        const indexMatch = indexKey.match(/\d+/);
        const index = indexMatch ? indexMatch[0] : null;
        const id = formData[`cities[${index}].id`];
        const interestObject = new InterestCity();
        interestObject.idCity = id;
        return interestObject;
    });

    return citiesArray;
}

const _mapInterestsToData = (req: Request) => {
    const formData = req.body;

    const indexes = Object.keys(formData).filter(key => key.match(/^interests\[\d+\]\.id$/));

    const interestsArray = indexes.map(indexKey => {
        const indexMatch = indexKey.match(/\d+/);
        const index = indexMatch ? indexMatch[0] : null;
        const idInterest = formData[`interests[${index}].idInterest`];
        const interestObject = new Interest();
        interestObject.id = null;
        interestObject.idInterest = idInterest;
        return interestObject;
    });

    return interestsArray;
}

const _mapRequestToData = async (req: Request) => {
    const data = req.body as unknown as User;
    const images = (req.files as Record<string, any>);
   
    const profileImage = images.find(
        (file: Express.Multer.File) =>
            file.fieldname == 'profileImage'
    );

    if (profileImage) {
        data.profileImage = profileImage.buffer?.toString('base64');
    }
    data.address = req.body.address as Address;
    data.address.id = null

    data.cities = _mapCitiesToData(req);
    data.interests = _mapInterestsToData(req);
    data.id = null;
    if (req.body.password) {
        data.encriptedPassword = await BCrypt.hash(req.body.password, 10);
    }

    if (data.birthdayDate) {
        data.birthdayDate = moment(data.birthdayDate, 'DD/MM/YYYY').toDate();
    }

    return data;
}

const _getSearchFilters = (req: Request) => {
    const search = req.query.search || "";
    return {
        where: {
            ...(search && {
                [Op.or]: [
                    {
                        name: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                    {
                        email: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                    {
                        phone: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                ],
            }),
        },
    }
};

export default class UserController {
    public static async save(req: Request, res: Response) {
        try {
            const map = await _mapRequestToData(req);
            const user = await UserService.SaveWithDependences(map);
            return res.status(200).send({ id: user.id });
        } catch (error) {
            console.error(error);
            return res.status(500).json(error).send();
        }
    }

    public static async list(req: Request, res: Response) {
        try {
            const searchFilter = _getSearchFilters(req) as any;
            const entities = await User.findAll({
                ...searchFilter,
                limit: 50,
                attributes: ['name', 'profileImage', 'id', 'email', 'phone'],
            });
            res.status(200).json(entities);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error).send();
        }
    }
    public static async detailLoggedUser(req: Request, res: Response) {
        try {
            const AuthenticatedRequest = req as unknown as AuthenticatedRequest;
            const entity = AuthenticatedRequest.user;
            if (entity?.profileImage) {
                const image = await Buffer.from(entity.profileImage, 'base64').toString('ascii');
                if (image) {
                    entity.profileImage = `data:image/png;base64,${image}`;
                }
            }
            const entityJson = {
                id: entity?.id,
                name: entity?.name,
                profileImage: entity?.profileImage,
            }
            res.status(200).json(entityJson);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error).send();
        }
    }
}