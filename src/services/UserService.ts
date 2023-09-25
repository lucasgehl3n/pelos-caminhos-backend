import database from "../database/database";
import User from "../database/models/User";
import AdressService from "./AdressService";
import BaseService from "./BaseService";
import CityInterestService from "./CityInterest";
import InterestService from "./InterestService";

class UserService extends BaseService<User>{
    constructor() {
        super(User);
    }

    static async SaveWithDependences(user: User) {
        const t = await database.connection.transaction();
        try {
            if (user.address) {
                const address = await AdressService.Save(user.address, t);
                user.idAddress = address?.id;
            }

            const userSaved = await super.Save(user, t);

            if (user.cities) {
                for (const city of user.cities) {
                    city.idUser = userSaved.id;
                    await CityInterestService.Save(city, t);
                }
            }

            if (user.interests) {
                for (const interest of user.interests) {
                    interest.idUser = userSaved.id;
                    await InterestService.Save(interest, t);
                }
            }
            await t.commit();
        }
        catch (error) {
            await t.rollback();
            console.error('Error occurred during transaction:', error);
        }
    }

    static async GetByEmail(email: string) {
        return await User.findOne({
            where: {
                email: email
            },
            include: 'userRoles'
        });
    }

    static async GetByIdWithRoles(id: number) {
        return await User.findOne({
            where: {
                id: id
            },
            include: 'userRoles'
        });
    }
}

export default UserService;