import winston from 'winston';

export const log = winston.createLogger({
  transports: [new winston.transports.Console()],
});
