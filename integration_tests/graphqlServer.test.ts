// import { apolloServer } from '../src/graphqlServer';

// request
// .post("/graphql")
// .send({
//   query: "{ users{ id, name} }",
// })
// .set("Accept", "application/json")
// .expect("Content-Type", /json/)
// .expect(200)
// .end(function (err, res) {
//   if (err) return done(err);
//   expect(res.body).toBeInstanceOf(Object);
//   expect(res.body.data.users.length).toEqual(3);
//   done();
// });
// });

// describe('Graphql resolvers', () => {
//   it('Returns greeting', async () => {
//     const result = await apolloServer.executeOperation({
//       query: '{ hello(name: "Bro") }',
//     });
//     expect(result.data?.hello).toBe('Yo Bro!');
//   });

//   it('Adds a user to the database', async () => {
//     const result = await apolloServer.executeOperation({
//       query: `mutation {
//         createUser(email: "machin@bidule.com", username: "YoBro"){
//           id
//           email
//           username
//         }
//       }`,
//     });
//     expect(result.data?.hello).toBe('Yo Bro!');
//   });
// });
