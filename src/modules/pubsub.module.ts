import { Module } from '@nestjs/common';
import { PubSubService } from '../services/pubsub.service';
import { NotificationService } from '../services/notification.service';

@Module({
  providers: [NotificationService, PubSubService],
  exports: [PubSubService], // Export the service if you need it in other modules
})
export class PubSubModule {}
