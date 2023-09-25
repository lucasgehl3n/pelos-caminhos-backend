import { DataTypes, Model, Sequelize } from "sequelize";
import User from "./User";
import database from "../database";
class Interest extends Model {
    public id!: number | null;
    public idInterest!: string;
    public idUser?: string;
}

Interest.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        idInterest: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        idUser: {
            type: DataTypes.INTEGER,
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
        tableName: 'interest',
        sequelize: database.connection,
    }
);

User.hasMany(
    Interest,
    {
        foreignKey: 'idUser',
        as: 'interests'
    }
);

export default Interest;