import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { NatsCoreModule } from './nats-core/nats-core.module';
import { NatsJetStreamModule } from './nats-jetstream/nats-jet-stream.module';
import { NatsModule } from './nats/nats.module';
import { NatsCoreService } from './nats-core/nats-core.service';

@Module({
  controllers: [AppController],
  imports: [NatsModule, NatsCoreModule, NatsJetStreamModule],
})
export class AppModule {
  constructor(private readonly natsCoreService: NatsCoreService) {}
  async onModuleInit() {
    this.natsCoreService.listenToMessages('example.subject');
  }
}
