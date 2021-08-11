import fs from 'fs';
import crypto from 'crypto';
import express, { Application } from 'express';
import { defaultPort } from './config';

const app: Application = express();

app.get('/ping', (_, res) => {
  res.send({ data: 'pong!' });
});

app.get('/save-key', (_, res) => {
  const hash = crypto.randomBytes(Math.ceil(50)).toString('hex');
  fs.appendFileSync(`${process.cwd()}/keys.txt`, `${hash}\n`);
  res.send({ success: true });
});

const PORT = process.env.PORT || defaultPort;

// const writeToFile = (content: string) => {
//   fs.appendFileSync(`${process.cwd()}/content.txt`, content);
// };

export const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
