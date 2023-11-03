
import { DataTypes, Model, Sequelize } from "sequelize";
import database from "../database";
import Animal from "./Animal";

class Color extends Model {
    public id!: number | null;
    public name!: string;
    public class!: string;
    public color!: string;
    public image!: Blob;
}

Color.init(
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
        class: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        color: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: 'text-black',
        },
        image: {
            type: DataTypes.BLOB,
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
        tableName: 'color',
        sequelize: database.connection,
    }
);

Animal.belongsTo(Color, {
    foreignKey: 'idColor',
    as: 'color'
});


export default Color;