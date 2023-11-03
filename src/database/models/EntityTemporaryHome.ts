import { DataTypes, Model, Sequelize } from "sequelize";
import database from "../database";
import Animal from "./Animal";
import Institution from "./Institution";
import User from "./User";

class EntityTemporaryHome extends Model {
    public id!: number | null;
    public name!: string;
    public details?: string;
    public idInstitution !: number;
    public idUser ?: number;
    public user ?: User;
}

EntityTemporaryHome.init(
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
        details: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        idInstitution: {
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
        tableName: 'entityTemporaryHome',
        sequelize: database.connection,
    }
);

Institution.hasMany(EntityTemporaryHome, {
    foreignKey: 'idInstitution',
    as: 'entityTemporaryHomes'
});

EntityTemporaryHome.belongsTo(Institution, {
    foreignKey: 'idInstitution',
    as: 'institution'
});

EntityTemporaryHome.belongsTo(User, {
    foreignKey: 'idUser',
    as: 'user'
});

EntityTemporaryHome.hasMany(Animal, {
    foreignKey: 'idTemporaryHome',
    as: 'animals'
});

Animal.belongsTo(EntityTemporaryHome, {
    foreignKey: 'idTemporaryHome',
    as: 'temporaryHome'
});

export default EntityTemporaryHome;