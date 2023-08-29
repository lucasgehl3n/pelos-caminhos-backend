import User from "../database/models/User";
import BaseService from "./BaseService";

class UserService extends BaseService<User>{
    constructor() {
        super(User);
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