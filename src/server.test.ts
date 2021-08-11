import request from 'supertest';
import { server } from './server';
import fs from 'fs';

jest.mock('fs');
describe('Test PingController', () => {
  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Ping request working', (done) => {
    request(server)
      .get('/ping')
      .expect(200)
      .then((result) => {
        expect(result.body.data).toBe('pong!');
        done();
      });
  });

  it('Append new key to the key file', (done) => {
    jest.spyOn(fs, 'appendFileSync').mockImplementation();
    request(server)
      .get('/save-key')
      .expect(200)
      .then((response) => {
        expect(fs.appendFileSync).toHaveBeenCalled();
        expect(response.body.success).toBeTruthy();
        done();
      });
  });
});
