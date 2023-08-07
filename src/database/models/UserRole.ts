import { Model, DataTypes } from 'sequelize';
import database from '../database';
import User from './User';
import Institution from './Institution';

class UserRole extends Model {
    public id!: number;
    public idUser!: number;
    public idInstitution?: number;
    public idRole?: number;
}

UserRole.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        idUser:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        idInstitution:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        idRole:{
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        tableName: 'user_role',
        sequelize: database.connection,
    }
);

User.hasMany(UserRole, {
    foreignKey:'idUser',
    as: 'userRoles'
});

Institution.hasMany(UserRole, {
    foreignKey:'idInstitution',
});


export default UserRole;