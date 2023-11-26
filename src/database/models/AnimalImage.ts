import { DataTypes, Model, Sequelize } from "sequelize";
import database from "../database";
import Animal from "./Animal";

class AnimalImage extends Model {
    public id!: number | null;
    public description!: string;
    public image!: Buffer | string;
    public type!: string;
    public idAnimal!: number;
    public animal!: Animal;
}

AnimalImage.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        description: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        image: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(50),
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
        tableName: 'animalImage',
        sequelize: database.connection,
    }
);

AnimalImage.belongsTo(Animal, {
    foreignKey: 'idAnimal',
    as: 'animal'
});

Animal.hasMany(AnimalImage, {
    foreignKey: 'idAnimal',
    as: 'animalImages' 
});



export default AnimalImage;