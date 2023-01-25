import { Injectable, Logger } from '@nestjs/common';
import { UserCreateDto } from '../dto/user-create.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../../events/user-created.event';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  createUser(body: UserCreateDto): UserCreateDto {
    this.eventEmitter.emit('user.created', new UserCreatedEvent(body));
    const establishedWebSocketsTimeout = setTimeout(() => {
      this.establishWebSocketsConnection(body.email);
    }, 2000);
    this.schedulerRegistry.addTimeout(
      `${body.email}-websockets-connection`,
      establishedWebSocketsTimeout,
    );
    return body;
  }

  private establishWebSocketsConnection(user: string) {
    this.logger.log('Establishing web sockets connection with user', user);
  }

  @OnEvent('user.created', { async: true })
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.logger.log('User created event received');
  }

  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'myCron' })
  handleCron() {
    const date = new Date();
    this.logger.debug(
      `Cron executed at ${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    );
  }
}
