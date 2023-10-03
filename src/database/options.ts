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
            require: true, // Requer SSL
            rejectUnauthorized: false // Desativa a verificação do certificado SSL (use apenas em ambientes de desenvolvimento)
        }
    }
};


const getOptions = () => {
    if (process.env._NODE_ENV === 'production') {
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
    }
}

export default options;