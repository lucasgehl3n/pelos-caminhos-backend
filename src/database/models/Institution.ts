import { Model, DataTypes } from 'sequelize';
import database from '../database';
import Address from './Address';
import InstitutionImage from './InstitutionImage';

import User from './User';
class Institution extends Model {
    public id!: number | null;
    public name!: string;
    public document?: string;
    public description!: string;
    public phone?: string;
    public site?: string;
    public email?: string;
    public image?: string | null;
    public receive_volunteers!: string;
    public adress!: Address
    public idAddress!: number
    public publicImages!: InstitutionImage[]
    public idUserCreator!: number | null;
}

Institution.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        document: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        site: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.BLOB,
            allowNull: true,
        },
        receive_volunteers: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        idUserCreator: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        tableName: 'institution',
        sequelize: database.connection,
    }
);


Institution.belongsTo(User, {
    foreignKey: 'idUserCreator', 
    as: 'userCreator'
});

Institution.belongsTo(Address, {
    foreignKey:'idAddress',
    as: 'address',
}); 
export default Institution;