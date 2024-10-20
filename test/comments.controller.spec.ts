import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from '../src/controllers/comments.cotroller';
import { CommentsService } from '../src/services/comments.service';

describe('CommentsController', () => {
  let controller: CommentsController;
  let commentsService: Partial<CommentsService>;

  beforeEach(async () => {
    commentsService = {
      createComment: jest.fn(),
      getCommentsByTaskId: jest.fn(),
      updateComment: jest.fn(),
      deleteComment: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: commentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  describe('createComment', () => {
    it('should create a new comment', async () => {
      const commentData = {
        task_id: '1',
        author_id: 'author-1',
        content: 'This is a comment.',
      };

      commentsService.createComment = jest.fn().mockResolvedValue(commentData);

      const result = await controller.createComment(commentData);

      expect(result).toEqual(commentData);
      expect(commentsService.createComment).toHaveBeenCalledWith(commentData);
    });
  });

  describe('getCommentsByTaskId', () => {
    it('should return comments for a specific task ID', async () => {
      const taskId = '1';
      const mockComments = [
        {
          id: '1',
          task_id: taskId,
          author_id: 'author-1',
          content: 'Comment 1',
        },
        {
          id: '2',
          task_id: taskId,
          author_id: 'author-2',
          content: 'Comment 2',
        },
      ];

      commentsService.getCommentsByTaskId = jest
        .fn()
        .mockResolvedValue(mockComments);

      const result = await controller.getCommentsByTaskId(taskId);

      expect(result).toEqual(mockComments);
      expect(commentsService.getCommentsByTaskId).toHaveBeenCalledWith(taskId);
    });
  });

  describe('updateComment', () => {
    it('should update an existing comment', async () => {
      const id = '1';
      const updateData = { content: 'Updated comment content' };
      const updatedComment = { id, ...updateData };

      commentsService.updateComment = jest
        .fn()
        .mockResolvedValue(updatedComment);

      const result = await controller.updateComment(id, updateData);

      expect(result).toEqual(updatedComment);
      expect(commentsService.updateComment).toHaveBeenCalledWith(
        id,
        updateData,
      );
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment by its ID', async () => {
      const id = '1';
      const deletedComment = {
        id,
        task_id: '1',
        author_id: 'author-1',
        content: 'Comment to delete',
      };

      commentsService.deleteComment = jest
        .fn()
        .mockResolvedValue(deletedComment);

      const result = await controller.deleteComment(id);

      expect(result).toEqual(deletedComment);
      expect(commentsService.deleteComment).toHaveBeenCalledWith(id);
    });
  });
});
