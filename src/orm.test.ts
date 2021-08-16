import { User } from './entity/User';
import { Repository } from 'typeorm';
import { mock } from 'jest-mock-extended';
import { Orm } from './orm';

const repositoryMock = mock<Repository<any>>();

jest.mock('typeorm', () => ({
  getRepository: () => repositoryMock,
  PrimaryGeneratedColumn: () => {},
  Column: () => {},
  Entity: () => {},
}));

it('should call the correct BeforeInsert method', () => {
  const user = new User();
  user.username = 'machin';
  user.email = 'bidule';
  Orm.addUser(user);
  expect(repositoryMock.save).toHaveBeenCalledTimes(1);
  expect(repositoryMock.save).toHaveBeenCalledWith({
    email: 'bidule',
    username: 'machin',
  });
});
