import { Model, DataTypes, Sequelize } from 'sequelize';
import database from '../database';
import UserRole from './UserRole';
import Address from './Address';
import InterestCity from './InterestCity';
import Interest from './Interest';

class User extends Model {
    public id!: number | null;
    public name?: string;
    public email!: string;
    public document!: string;
    public encriptedPassword!: string;
    public birthdayDate!: Date;
    public phone!: string;
    public profileImage!: string | null | Buffer;
    public address!: Address;
    public userRoles!: UserRole[];
    public cities!: InterestCity[];
    public interests!: Interest[];
    public idAddress!: number;
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
        },
        document:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        birthdayDate:{
            type: DataTypes.DATE,
            allowNull: false,
        },
        phone:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        profileImage:{
            type: DataTypes.BLOB,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
    },
    {
        tableName: 'user',
        sequelize: database.connection,
    }
);

export default User;