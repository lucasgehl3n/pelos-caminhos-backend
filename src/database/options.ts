import { Options } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

let options: Options = {
    dialect: "postgres",
    host: process.env.DB_HOST,
    username:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    logging: false,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 0,
    define: {
        timestamps: true,
    }
}

export default options;