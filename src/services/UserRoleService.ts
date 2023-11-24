import database from "../database/database";
import Institution from "../database/models/Institution";
import User from "../database/models/User";
import UserRole from "../database/models/UserRole";
import { Roles } from "../enums/Roles";
import BaseService from "./BaseService";

class UserRoleService extends BaseService<UserRole>{
    constructor() {
        super(UserRole);
    }

    static async GenerateUserServiceToInstitution(user: User, institution: Institution) {
        const userRole = {
            idInstitution: institution.id,
            idRole: Roles.Administrator,
            idUser: user.id,
        };

        try {
            const userRoleEntity = await super.Save(userRole);
            user.userRoles.push(userRoleEntity);
        }
        catch (error) {
            console.error('Error occurred during transaction:', error);
        }
    }
}

export default UserRoleService;