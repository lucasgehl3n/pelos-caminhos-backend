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
    port: 5432,
    define: {
        timestamps: true,
    }
}

export default options;