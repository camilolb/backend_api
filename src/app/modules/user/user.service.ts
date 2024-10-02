import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MessagesMapping } from '@shared/messages-mapping';
import { BaseService } from '@shared/services/base.service';

import { CreateUserDto } from './dtos/create-user.dto';
import { UserRepository } from './repositories/user.repository';
import { UserDocument } from './models/user.entity';

@Injectable()
export class UserService extends BaseService<UserDocument, UserRepository> {
  constructor(protected readonly repository: UserRepository) {
    super();
  }
  async getLoggedinUserDetails(userId: string): Promise<UserDocument> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new HttpException(MessagesMapping['#9'], HttpStatus.NOT_FOUND);
    }

    user.password = undefined;

    return user;
  }

  async deleteLoggedinUserDetails(userId: string): Promise<UserDocument> {
    const user = await this.repository.deleteById(userId);

    if (!user) {
      throw new HttpException(MessagesMapping['#9'], HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async create(userDto: CreateUserDto): Promise<UserDocument> {
    const user = await this.repository.create(userDto);

    return user;
  }
}
