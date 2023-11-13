import { Options } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

let devOptions = {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

let prodOptions = {
    dialectOptions: {
        ssl: {
            require: true, 
            rejectUnauthorized: false 
        }
    }
};


const getOptions = () => {
    if (process.env.NODE_ENV === 'production') {
        return prodOptions;
    }
    return devOptions;
}

let options: Options = {
    dialect: "postgres",
    ...getOptions(),
    logging: false,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 0,
    define: {
        timestamps: true,
    },
    dialectOptions: {
        ssl: false, // Configuração para desativar SSL
    },
}

export default options;