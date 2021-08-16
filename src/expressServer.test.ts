import { Server } from 'http';
import supertest from 'supertest';
import { app } from '../src/expressServer';
import fs from 'fs';

let server: Server;

const request = supertest(app);

jest.mock('fs');

xdescribe('Express server', () => {
  afterAll(async () => {
    // Clean up
    server.close();
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
    jest.spyOn(fs, 'appendFileSync').mockImplementation();
    request
      .get('/save-key')
      .expect(200)
      .then((response) => {
        expect(fs.appendFileSync).toHaveBeenCalled();
        expect(response.body.success).toBeTruthy();
        done();
      });
  });
});
