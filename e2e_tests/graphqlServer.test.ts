import { Server } from 'http';
import supertest from 'supertest';
import { Connection, createConnection } from 'typeorm';
import config from '../src/config';
import { apolloServer, app } from '../src/graphqlServer';

let server: Server;
let connection: Connection;

const request = supertest(app);

describe('Graphql server', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
    const { host, port } = config.server;
    server = app.listen({ port, host }, () => {
      console.log(
        `🚀 Server ready at http://${host}:${port}${apolloServer.graphqlPath}`
      );
    });
  });

  afterAll(async () => {
    // Clean up
    await connection.close();
    server.close();
  });

  it('Returns greeting', (done) => {
    request
      .post('/graphql')
      .send({
        query: '{ hello(name: "Bro") }',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.data.hello).toBe('Yo Bro!');
        done();
      });
  });

  // it('Adds a user to the database', async () => {
  //   const result = await apolloServer.executeOperation({
  //     query: `mutation {
  //       createUser(email: "machin@bidule.com", username: "YoBro"){
  //         id
  //         email
  //         username
  //       }
  //     }`,
  //   });
  //   expect(result.data?.hello).toBe('Yo Bro!');
  // });
});
