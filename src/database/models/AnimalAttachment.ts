import { DataTypes, Model, Sequelize } from "sequelize";
import database from "../database";
import Animal from "./Animal";

class AnimalAttachment extends Model {
    public id!: number | null;
    public description!: string;
    public file!: string;
    public type!: string;
    public idAnimal!: number;
    public animal!: Animal;
}

AnimalAttachment.init(
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
        file: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(100),
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
        tableName: 'animalAttachment',
        sequelize: database.connection,
    }
);

AnimalAttachment.belongsTo(Animal, {
    foreignKey: 'idAnimal',
    as: 'animal'
});

Animal.hasMany(AnimalAttachment, {
    foreignKey: 'idAnimal',
    as: 'animalAttachments' 
});



export default AnimalAttachment;