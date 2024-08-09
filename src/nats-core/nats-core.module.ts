import { Module } from '@nestjs/common';
import { NatsCoreService } from './nats-core.service';

@Module({
  providers: [NatsCoreService],
  exports: [NatsCoreService],
})
export class NatsCoreModule {}
