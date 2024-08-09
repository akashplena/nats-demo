import { Injectable, Logger } from '@nestjs/common';
import { NatsService } from 'src/nats/nats.service';

@Injectable()
export class NatsCoreService {
  private logger: Logger = new Logger('NatsCoreService');

  constructor(private readonly natsService: NatsService) {}

  async sendMessage(subject: string, message: string) {
    const natsConnection = this.natsService.getConnection();
    natsConnection.publish(subject, message);
  }

  listenToMessages(subject: string) {
    const natsConnection = this.natsService.getConnection();

    const subscription = natsConnection.subscribe(subject);

    (async () => {
      for await (const msg of subscription) {
        const messageString = msg.string();
        this.logger.log(
          `Received message on subject ${subject}:`,
          messageString,
        );
      }
    })().catch((err) => {
      this.logger.error('Error processing NATS messages:', err);
    });
  }
}
