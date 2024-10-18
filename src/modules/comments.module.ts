import { Module } from '@nestjs/common';
import { CommentsController } from '../controllers/comments.cotroller';
import { CommentsService } from '../services/comments.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
