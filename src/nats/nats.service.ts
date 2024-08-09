import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { connect, NatsConnection } from 'nats';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private logger: Logger = new Logger('NatsService');
  private natsConnection: NatsConnection;

  async onModuleInit() {
    try {
      this.natsConnection = await connect({ servers: 'nats://localhost:4222' });
      this.logger.log('NATS connected!');
    } catch (err) {
      this.logger.error('NATS connection error!', err);
    }
  }

  async onModuleDestroy() {
    await this.natsConnection.close();
  }

  getConnection(): NatsConnection {
    return this.natsConnection;
  }
}
