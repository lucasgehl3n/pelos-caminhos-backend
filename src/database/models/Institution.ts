import { Model, DataTypes } from 'sequelize';
import database from '../database';

class Institution extends Model {
    public id!: number;
    public name!: string;
    public cnpj?: string;
    public description!: string;
    public phone?: string;
    public site?: string;
    public email?: string;
    public image?: string;
    public receive_volunteers!: string;
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
        cnpj:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        description:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        site:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        image:{
            type: DataTypes.BLOB,
            allowNull: true,
        },
        receive_volunteers:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: 'institution',
        sequelize: database.connection,
    }
);

export default Institution;