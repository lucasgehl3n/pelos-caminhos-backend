import { DataTypes, Model, Sequelize } from "sequelize";
import database from "../database";
import Animal from "./Animal";
class TreatmentAnimal extends Model {
    public id!: number | null;
    public idAnimal!: number;
    public name!: string;
    public details!: string;
    public initialDate!: Date;
    public endForecastDate!: Date;
    public done!: boolean;
    public endDate!: Date;
}

TreatmentAnimal.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        details: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        initialDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endForecastDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        done: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        endDate: {
            type: DataTypes.DATE,
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
        tableName: 'treatmentAnimal',
        sequelize: database.connection,
    }
);


Animal.hasMany(TreatmentAnimal, {
    foreignKey: 'idAnimal',
    as: 'treatment'
});

TreatmentAnimal.belongsTo(Animal, {
    foreignKey: 'idAnimal',
    as: 'animal'
});

export default TreatmentAnimal;