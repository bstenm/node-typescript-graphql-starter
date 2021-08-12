export default {
  server: {
    host: '127.0.0.1',
    port: process.env.NODE_ENV == 'test' ? 5001 : 3000,
  },
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'starter',
    username: 'postgres',
    password: 'postgres',
    synchronize: true,
    logging: false,
  },
};
