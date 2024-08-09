import { Injectable, OnModuleInit } from '@nestjs/common';
import { JetStreamManager, JetStreamClient, JsMsg, AckPolicy } from 'nats';
import { NatsService } from '../nats/nats.service';

@Injectable()
export class NatsJetStreamService implements OnModuleInit {
  private jsm: JetStreamManager;
  private jsClient: JetStreamClient;
  private streamName = 'example-stream';
  private consumerName = 'example-consumer';
  private subject = 'example.subject';

  constructor(private readonly natsService: NatsService) {}

  async onModuleInit() {
    const natsConnection = this.natsService.getConnection();

    try {
      this.jsm = await natsConnection.jetstreamManager();
      this.jsClient = natsConnection.jetstream();

      await this.jsm.streams.add({
        name: this.streamName,
        subjects: [this.subject],
      });

      await this.jsm.consumers.add(this.streamName, {
        durable_name: this.consumerName,
        ack_policy: AckPolicy['Explicit'],
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async fetchMessages(): Promise<JsMsg[]> {
    const consumer = await this.jsClient.consumers.get(
      this.streamName,
      this.consumerName,
    );
    const messages = await consumer.fetch({ expires: 1000 });
    const result: JsMsg[] = [];
    for await (const m of messages) {
      result.push(m);
      m.ack();
    }
    return result;
  }
}
