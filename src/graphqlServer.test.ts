// import { mock } from 'jest-mock-extended';
// import { Repository, SelectQueryBuilder } from 'typeorm';
// import { apolloServer } from './graphqlServer';

// describe('Graphql resolvers', () => {
//   it('Returns greeting', async () => {
//     const result = await apolloServer.executeOperation({
//       query: '{ hello(name: "Bro") }',
//     });
//     expect(result.data?.hello).toBe('Yo Bro!');
//   });

//   it('Adds a user to the database', async () => {
//     const repositoryMock = mock<Repository<any>>();
//     const qbuilderMock = mock<SelectQueryBuilder<any>>();

//     jest.mock('typeorm', () => {
//       qbuilderMock.where.mockReturnThis();
//       qbuilderMock.select.mockReturnThis();
//       repositoryMock.save.mockImplementation();
//       repositoryMock.createQueryBuilder.mockReturnValue(qbuilderMock);

//       return {
//         BaseEntity: class Mock {},
//         getRepository: () => repositoryMock,
//         ObjectType: () => {},
//         Entity: () => {},
//         InputType: () => {},
//         Index: () => {},
//         PrimaryGeneratedColumn: () => {},
//         Column: () => {},
//         CreateDateColumn: () => {},
//         UpdateDateColumn: () => {},
//         OneToMany: () => {},
//         ManyToOne: () => {},
//       };
//     });
//     await apolloServer.executeOperation({
//       query: `mutation {
//         createUser(email: "machin@bidule.com", username: "YoBro"){
//           id
//           email
//           username
//         }
//       }`,
//     });
//     expect(repositoryMock.save).toHaveBeenCalled();
//   });
// });

import { mock } from 'jest-mock-extended';

interface PartyProvider {
  getPartyType: () => string;
  getSongs: (type: string) => string[];
  start: (type: string) => void;
}

describe('Party Tests', () => {
  test('Mock out an interface', () => {
    const mockParty = mock<PartyProvider>();
    mockParty.start('disco party');

    expect(mockParty.start).toHaveBeenCalledWith('disco party');
  });

  test('mock out a return type', () => {
    const mockParty = mock<PartyProvider>();
    mockParty.getPartyType.mockReturnValue('west coast party');

    expect(mockParty.getPartyType()).toBe('west coast party');
  });
});
