import { DataTypes, Model, Sequelize } from "sequelize";
import database from "../database";
import Animal from "./Animal";

class Breed extends Model {
    public id!: number | null;
    public name!: string;
    public AITag!: string;
    public idSpecie!: number;
}

Breed.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        idSpecie: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        AITag: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    },
    {
        tableName: 'breed',
        sequelize: database.connection,
    }
);

Animal.belongsTo(Breed, {
    foreignKey: 'idBreed',
    as: 'breed'
});


export default Breed;