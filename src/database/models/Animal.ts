import { Model, DataTypes } from 'sequelize';
import database from '../database';

class Animal extends Model {
    public id!: number;
    public name!: string;
}

Animal.init(
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
    },
    {
        tableName: 'animal',
        sequelize: database.connection,
    }
);

export default Animal;