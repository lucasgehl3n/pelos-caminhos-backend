import { DataTypes, Model, Sequelize } from "sequelize";
import database from "../database";
import User from "./User";
import City from "./City";

class InterestCity extends Model {
    public id!: number | null;
    public idUser!: number;
    public idCity?: number;
}

InterestCity.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    idCity: {
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
}, {
    tableName: 'interest_city',
    sequelize: database.connection,
});

InterestCity.belongsTo(User, {
    foreignKey: 'idUser',
    as: 'user',
});

InterestCity.belongsTo(City, {
    foreignKey: 'idCity',
    as: 'city',
});

export default InterestCity;