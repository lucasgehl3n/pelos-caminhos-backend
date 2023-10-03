import * as dotenv from 'dotenv';
import app from './app';
dotenv.config();

app.listen(process.env._PORT, () => {
  console.log(`{ defaultUrl: http://localhost:${process.env._PORT} }`);
});