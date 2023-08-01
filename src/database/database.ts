import Sequelize from 'sequelize';

import options from './options';
class Database {
    connection!: Sequelize.Sequelize;

    constructor() {
        this.connection = new Sequelize.Sequelize(options);
    }
}

export default new Database();