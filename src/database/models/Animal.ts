import { Model, DataTypes } from 'sequelize';
import database from '../database';
import Institution from './Institution';
import User from './User';
import EntityTemporaryHome from './EntityTemporaryHome';
import MedicineAnimal from './MedicineAnimal';
import AnimalImage from './AnimalImage';
import TreatmentAnimal from './TreatmentAnimal';
import AnimalAttachment from './AnimalAttachment';
import AnimalPrediction from './AnimalPrediction';
import Breed from './Breed';

class Animal extends Model {
    public id!: number;
    public name!: string;
    public species!: number;
    public size!: number;
    public gender!: number;
    public collectionDate!: Date;
    public collectionPlace!: string;
    public age?: number;
    public weight?: number;
    public deathDate!: Date;
    public deathDetail!: string;
    public idBreed!: number;
    public adoptionDate!: Date;
    public adoptionUser!: User;
    public adoptionSolictationDate!: Date;
    public adoptionApprovalDate!: Date;
    public observation!: string;
    public forwardingDate!: Date;
    public idInstitution!: number;
    public institution!: Institution;
    public idUserAdoption!: number;
    public idSituation!: number;
    public idTemporaryHome!: number;
    public temporaryHome!: EntityTemporaryHome;
    public medicineAnimal!: MedicineAnimal[];
    public animalImages!: AnimalImage[];
    public breed!: Breed;
    public animalAttachments!: AnimalAttachment[];
    public treatment!: TreatmentAnimal[];
    public predictions!: AnimalPrediction[];
    public castrated!: boolean;
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
        species: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        gender: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        collectionDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        collectionPlace: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        weight: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        deathDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        deathDetail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        adoptionDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        adoptionSolictationDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        adoptionApprovalDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        observation: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        forwardingDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        idSituation: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        castrated: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
    },
    {
        tableName: 'animal',
        sequelize: database.connection,
    }
);

Animal.belongsTo(Institution, {
    foreignKey: 'idInstitution',
    as: 'institution'
});

Animal.belongsTo(User, {
    foreignKey: 'idUserAdoption',
    as: 'adoptionUser'
});
export default Animal;