import * as nodePath from 'path';
import * as dotenv from 'dotenv';
import * as Redis from 'ioredis';

dotenv.config({
  path: nodePath.resolve(
    `${__dirname}/../../.env.${process.env.NODE_ENV}.local`
  ),
});

const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;
const path = process.env.SERVER_PATH;

const redis: Redis.RedisOptions = {
  host: '127.0.0.1',
  port: 6379,
  retryStrategy: (times: number) => Math.max(times * 100, 3000),
};

export const config = {
  server: { host, port, path },
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
  endPoint: {
    ws: `ws://${host}:${port}${path}`,
    http: `http://${host}:${port}${path}`,
  },
  redis,
};
