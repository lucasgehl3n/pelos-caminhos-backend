import { Model, DataTypes } from 'sequelize';
import database from '../database';
import Institution from './Institution';

class Address extends Model {
    public id!: number | null;
    public street!: string;
    public number!: string;
    public cep!: string;
    public complement!: string;
}

Address.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        street: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        number: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cep: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        complement: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: 'address',
        sequelize: database.connection,
    }
);





export default Address;