import { Controller, Post, Body, Get, Logger } from '@nestjs/common';
import { NatsCoreService } from './nats-core/nats-core.service';
import { NatsJetStreamService } from './nats-jetstream/nats-jet-stream.service';

@Controller()
export class AppController {
  private logger: Logger = new Logger('AppController');

  constructor(
    private readonly natsCoreService: NatsCoreService,
    private readonly natsJetStreamService: NatsJetStreamService,
  ) {}

  @Post('send')
  async sendMessage(
    @Body('subject') subject: string,
    @Body('message') message: string,
  ) {
    await this.natsCoreService.sendMessage(subject, message);
    return { status: 'Message sent' };
  }

  @Get('messages')
  async getMessages() {
    const messages = await this.natsJetStreamService.fetchMessages();
    this.logger.log('Fetched messages');
    return messages.map((m) => ({ seq: m.seq, data: m.data.toString() }));
  }
}
