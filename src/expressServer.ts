import fs from 'fs';
import crypto from 'crypto';
import express, { Application } from 'express';

const app: Application = express();

app.get('/ping', (_, res) => {
  res.send({ data: 'pong!' });
});

app.get('/save-key', (_, res) => {
  const hash = crypto.randomBytes(Math.ceil(50)).toString('hex');
  fs.appendFileSync(`${process.cwd()}/keys.txt`, `${hash}\n`);
  res.send({ success: true });
});

export { app };
