import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(`${__dirname}/../../.env.${process.env.NODE_ENV}.local`),
});

export default {
  server: {
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
    path: process.env.SERVER_PATH,
  },
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    synchronize: true,
    logging: false,
  },
};
