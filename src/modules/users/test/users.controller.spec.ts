import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { AuthGuard } from '../../auth/auth.guard';
import { AdminOnly } from '../../../guards/role.guard';

const mockUsersService = () => ({
  create: jest.fn(),
  update: jest.fn(),
  updateEmail: jest.fn(),
  updatePassword: jest.fn(),
  updateStatus: jest.fn(),
  getAll: jest.fn(),
  findByUserEmailAuth: jest.fn(),
  findByUserEmail: jest.fn(),
  findByUserId: jest.fn(),
  deleteByUserEmail: jest.fn(),
});

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useFactory: mockUsersService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(AdminOnly)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
