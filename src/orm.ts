import { getRepository } from 'typeorm';
import { User } from './entity/User';

export class Orm {
  static addUser(user: User) {
    return getRepository(User).save(user);
  }
}
