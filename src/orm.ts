import { getRepository } from 'typeorm';
import { User } from './entity/User';

export class Orm {
  static async addUser(user: User): Promise<User> {
    return await getRepository(User).save(user);
  }
}
