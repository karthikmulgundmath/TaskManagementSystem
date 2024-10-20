import { Module } from '@nestjs/common';
import { PubSubService } from '../services/pubsub.service';

@Module({
  providers: [PubSubService],
  exports: [PubSubService], // Export the service if you need it in other modules
})
export class PubSubModule {}
