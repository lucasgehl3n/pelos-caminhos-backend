import { Model, DataTypes } from 'sequelize';
import database from '../database';
import UserRole from './UserRole';

class User extends Model {
    public id!: number;
    public name?: string;
    public email!: string;
    public encriptedPassword!: string;
    public userRoles!: UserRole[];
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        encriptedPassword:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: 'user',
        sequelize: database.connection,
    }
);

export default User;