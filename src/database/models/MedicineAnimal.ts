import { DataTypes, Model, Sequelize } from "sequelize";
import database from "../database";
import Animal from "./Animal";

class MedicineAnimal extends Model {
    public id!: number | null;
    public name!: string;
    public recurrence_days!: number;
    public recurrence_per_days!: number;
    public quantity_ml!: number;
    public idAnimal!: number;
    public done!: boolean;
    public application_date!: Date;
    public application_hour!: string;
    public observation!: string;
    public endDate!: Date;
    public initialDate!: Date;
}

MedicineAnimal.init(
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
        recurrence_days: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        recurrence_per_days: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        quantity_ml: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        done: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        application_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        application_hour: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        initialDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        observation: {
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
        tableName: 'medicineAnimal',
        sequelize: database.connection,
    }
);

Animal.hasMany(MedicineAnimal, {
    foreignKey: 'idAnimal',
    as: 'medicineAnimal'
});

export default MedicineAnimal;