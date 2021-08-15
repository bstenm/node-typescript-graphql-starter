import { Repository, SelectQueryBuilder } from 'typeorm';
import { mock } from 'jest-mock-extended';

const repositoryMock = mock<Repository<any>>();
const qbuilderMock = mock<SelectQueryBuilder<any>>();

jest.mock('typeorm', () => {
  qbuilderMock.where.mockReturnThis();
  qbuilderMock.select.mockReturnThis();
  repositoryMock.createQueryBuilder.mockReturnValue(qbuilderMock);

  return {
    getRepository: () => repositoryMock,

    BaseEntity: class Mock {},
    ObjectType: () => {},
    Entity: () => {},
    InputType: () => {},
    Index: () => {},
    PrimaryGeneratedColumn: () => {},
    Column: () => {},
    CreateDateColumn: () => {},
    UpdateDateColumn: () => {},
    OneToMany: () => {},
    ManyToOne: () => {},
  };
});
