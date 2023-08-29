import { Model, DataTypes } from 'sequelize';
import database from '../database';
import Institution from './Institution';

class InstitutionImage extends Model {
    public id!: number | null; 
    public image?: string | null;
    public description?: string;
    public idInstitution!: number;
}

InstitutionImage.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        image: {
            type: DataTypes.BLOB,
            allowNull: true,
        },
        description:{
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: 'institutionImage',
        sequelize: database.connection,
    }
);

Institution.hasMany(InstitutionImage, {
    foreignKey:'idInstitution',
    as: 'publicImages'
});



export default InstitutionImage;