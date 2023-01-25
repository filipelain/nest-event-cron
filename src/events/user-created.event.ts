import { UserCreateDto } from '../users/dto/user-create.dto';

export class UserCreatedEvent {
  constructor(public readonly userData: UserCreateDto) {}
}
