import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../src/controllers/users.controller';
import { UsersService } from '../src/services/users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    usersService = {
      createUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('createUser', () => {
    it('should create a new user and return user data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'owner' as 'owner' | 'contributor', // Type assertion to ensure proper typing
      };

      const createdUser = { id: '1', ...userData };

      usersService.createUser = jest.fn().mockResolvedValue(createdUser);

      const result = await controller.createUser(userData);

      expect(result).toEqual(createdUser);
      expect(usersService.createUser).toHaveBeenCalledWith(
        userData.name,
        userData.email,
        userData.password,
        userData.role,
      );
    });
  });
});
