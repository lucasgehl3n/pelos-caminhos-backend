import * as dotenv from 'dotenv';
import app from './app';
import { Request, Response, NextFunction } from 'express';
dotenv.config();



app.listen(process.env.PORT, () => {
  console.log(`{ defaultUrl: http://localhost:${process.env.PORT} }`);
});