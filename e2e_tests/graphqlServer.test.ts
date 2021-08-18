import supertest, { SuperTest, Test } from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { graphqlServer } from '../src/graphqlServer';

let connection: Connection;

describe('Graphql server', () => {
  let request: SuperTest<Test>;

  beforeAll(async () => {
    const { httpServer } = await graphqlServer();
    request = supertest(httpServer);
    connection = await createConnection('test');
  });

  afterAll(async () => {
    // Clean up
    await connection.close();
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
