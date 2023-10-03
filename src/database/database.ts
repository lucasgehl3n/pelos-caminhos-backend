import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import options from './options';
class Database {
    connection!: Sequelize.Sequelize;

    constructor() {
        const connString = process.env.DATABASE_URL || "";

        if (process.env.NODE_ENV === 'production') {
            this.connection = new Sequelize.Sequelize(connString, options);
        } else {
            this.connection = new Sequelize.Sequelize(options);
        }
    }
}

export default new Database();