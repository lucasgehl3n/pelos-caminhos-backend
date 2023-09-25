import { DataTypes, Model, Sequelize } from "sequelize";
import database from "../database";
import State from "./State";
import User from "./User";

class City extends Model {
    public id!: number | null;
    public name!: string;
    public lat?: string;
    public long?: string;
    public stateId!: number;
    public user ?: User;
    public state ?: State;
}

City.init(
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
        lat: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lng: {
            type: DataTypes.STRING,
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
        tableName: 'city',
        sequelize: database.connection,
    }
);

State.hasMany(City, {
    foreignKey: 'idState',
});

City.belongsTo(State, {
    foreignKey: 'idState',
    as: 'state',
});

export default City;