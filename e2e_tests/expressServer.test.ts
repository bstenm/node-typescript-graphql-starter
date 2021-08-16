import { Server } from 'http';
import supertest from 'supertest';
import config from '../src/config';
import { app } from '../src/expressServer';
import fs from 'fs';

let server: Server;

const request = supertest(app);

const keyFile: string = `${process.cwd()}/keys.txt`;

xdescribe('Express server', () => {
  beforeAll(async () => {
    const { host, port } = config.server;
    server = app.listen({ port, host }, () => {
      console.log(`🚀 Server ready at http://${host}:${port}`);
    });
  });

  afterAll(async () => {
    // Clean up
    server.close();
    if (fs.existsSync(keyFile)) {
      fs.unlinkSync(keyFile);
    }
  });

  it('Ping request working', (done) => {
    request
      .get('/ping')
      .expect(200)
      .then((result) => {
        expect(result.body.data).toBe('pong!');
        done();
      });
  });

  it('Append new key to the key file', (done) => {
    request
      .get('/save-key')
      .expect(200)
      .then((response) => {
        expect(fs.existsSync(keyFile)).toBeTruthy();
        expect(response.body.success).toBeTruthy();
        done();
      });
  });
});
