import { DataTypes, Model, Sequelize } from "sequelize";
import Animal from "./Animal";
import database from "../database";
import Breed from "./Breed";

class AnimalPrediction extends Model {
    public id!: number | null;
    public percentage!: number;
    public idBreed!: number;
    public rank!: number;
    public idAnimal!: number;
    public breed!: Breed;
    public animal!: Animal;
}


AnimalPrediction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        percentage: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        rank: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        tableName: 'animalPrediction',
        sequelize: database.connection,
    }
);

AnimalPrediction.belongsTo(Animal, {
    foreignKey: 'idAnimal',
    as: 'animal'
});

Animal.hasMany(AnimalPrediction, {
    foreignKey: 'idAnimal',
    as: 'predictions' 
});

AnimalPrediction.belongsTo(Breed, {
    foreignKey: 'idBreed',
    as: 'breed'
});

Breed.hasMany(AnimalPrediction, {
    foreignKey: 'idBreed',
    as: 'predictions' 
});


export default AnimalPrediction;
