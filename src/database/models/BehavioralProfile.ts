import { DataTypes, Model, Sequelize } from "sequelize";
import database from "../database";
import Animal from "./Animal";

class BehavioralProfile extends Model {
    public id!: number | null;
    public name!: string;
    public description!: string;
}

BehavioralProfile.init(
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
        description: {
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
        tableName: 'behavioralProfile',
        sequelize: database.connection,
    }
);


Animal.belongsTo(BehavioralProfile, {
    foreignKey: 'idBehavioralProfile',
    as: 'behavioralProfile'
});



export default BehavioralProfile;