import * as dotenv from 'dotenv';
import app from './app';
dotenv.config();

app.listen(process.env.PORT, () => {
  console.log(`{ defaultUrl: http://localhost:${process.env.PORT} }`);
});