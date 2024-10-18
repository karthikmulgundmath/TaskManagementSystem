import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CommentsService } from '../services/comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createComment(
    @Body()
    commentData: {
      task_id: string;
      author_id: string;
      content: string;
    },
  ) {
    return await this.commentsService.createComment(commentData);
  }

  @Get('task/:taskId')
  async getCommentsByTaskId(@Param('taskId') taskId: string) {
    return await this.commentsService.getCommentsByTaskId(taskId);
  }

  @Put(':id')
  async updateComment(
    @Param('id') id: string,
    @Body() updateData: { content: string },
  ) {
    return await this.commentsService.updateComment(id, updateData);
  }

  @Delete(':id')
  /**
   * Delete a comment by its ID
   * @param id The ID of the comment to be deleted
   * @returns A Promise resolving to the deleted comment
   */
  /******  93f06572-3e65-4dc4-a383-6e025ac04c67  *******/
  async deleteComment(@Param('id') id: string) {
    return await this.commentsService.deleteComment(id);
  }
}
