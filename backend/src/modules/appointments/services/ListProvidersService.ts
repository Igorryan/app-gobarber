import { injectable, inject } from 'tsyringe';
import IUserRepository from '@modules/users/repositories/IUserRepository';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '@modules/users/infra/typeorm/entities/User';
import { classToClass } from 'class-transformer';

interface IRequest {
  except_user_id: string,
}

@injectable()
class ListProvidersService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }

  public async execute({ except_user_id }: IRequest): Promise<User[]> {
    let users = await this.cacheProvider.recovery<User[]>(`providers-list:${except_user_id}`);

    if (!users) {
      users = await this.usersRepository.findAllProviders(except_user_id);
      await this.cacheProvider.save(`providers-list:${except_user_id}`, classToClass(users))
    }


    return users;
  }
}

export default ListProvidersService;
