import * as dotenv from 'dotenv';
dotenv.config();

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI
}