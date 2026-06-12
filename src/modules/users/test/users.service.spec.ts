import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import * as classValidator from 'class-validator';
import { UsersService } from '../users.service';
import { UserEntity } from '../../../db/entities/user.entity';
import { AuditRepository } from '../../../audit/audit.repository';
import { PageOptions } from '../../../db/pagination/page-options.dto';
import { UpdateUserResponse } from '../user.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hashSync: jest.fn().mockReturnValue('hashed_password'),
  compareSync: jest.fn().mockReturnValue(false),
}));

const mockQueryBuilder = () =>
  ({
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
    getMany: jest.fn(),
    getOne: jest.fn(),
  }) as unknown as SelectQueryBuilder<UserEntity>;

const mockUserRepo = () => ({
  save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
  findOne: jest.fn(),
  remove: jest.fn().mockResolvedValue(undefined),
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder()),
});

const mockAuditRepo = () => ({
  logAudit: jest.fn().mockResolvedValue(undefined),
});

const createMockUser = (overrides: Partial<UserEntity> = {}): UserEntity => {
  const user = new UserEntity();
  user.id = 'a3e1f9c7-d2a1-41f0-9f9e-b86cb78a6ec3';
  user.name = 'John';
  user.last_name = 'Motta';
  user.email = 'john@example.com';
  user.password = 'hashed_password';
  user.is_active = true;
  user.is_banned = false;
  user.is_email_verified = false;
  user.role = 'USER';
  user.image = '';
  Object.assign(user, overrides);
  return user;
};

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<Repository<UserEntity>>;
  let auditRepository: jest.Mocked<AuditRepository>;
  let validateSpy: jest.SpyInstance;

  beforeEach(async () => {
    validateSpy = jest.spyOn(classValidator, 'validate').mockResolvedValue([]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: mockUserRepo,
        },
        {
          provide: AuditRepository,
          useFactory: mockAuditRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(UserEntity));
    auditRepository = module.get(AuditRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
    validateSpy.mockRestore();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const newUser = {
        name: 'John',
        last_name: 'Motta',
        email: 'john@example.com',
        password: 'Password123!',
      };

      usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder());
      const qb = usersRepository.createQueryBuilder() as unknown as {
        getOne: jest.Mock;
      };
      qb.getOne.mockResolvedValue(null);

      const result = await service.create(newUser);

      expect(result.error).toBe(false);
      expect(result.message).toBe('Usuário criado com sucesso');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists', async () => {
      const existingUser = createMockUser();
      usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder());
      const qb = usersRepository.createQueryBuilder() as unknown as {
        getOne: jest.Mock;
      };
      qb.getOne.mockResolvedValue(existingUser);

      await expect(
        service.create({
          name: 'John',
          last_name: 'Motta',
          email: 'john@example.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException when validation fails', async () => {
      validateSpy.mockResolvedValue([
        { constraints: { isString: 'name must be a string' } },
      ]);

      usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder());
      const qb = usersRepository.createQueryBuilder() as unknown as {
        getOne: jest.Mock;
      };
      qb.getOne.mockResolvedValue(null);

      await expect(
        service.create({
          name: '',
          last_name: 'Motta',
          email: 'john@example.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const user = createMockUser();
      usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder());
      const qb = usersRepository.createQueryBuilder() as unknown as {
        getOne: jest.Mock;
      };
      qb.getOne.mockResolvedValue(user);

      const result = await service.update('john@example.com', {
        name: 'Jane',
      } as unknown as UpdateUserResponse);

      expect(result.error).toBe(false);
      expect(result.message).toBe('Usuário atualizado com sucesso!');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder());
      const qb = usersRepository.createQueryBuilder() as unknown as {
        getOne: jest.Mock;
      };
      qb.getOne.mockResolvedValue(null);

      await expect(
        service.update('notfound@example.com', {
          name: 'Jane',
        } as unknown as UpdateUserResponse),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateEmail', () => {
    it('should update email successfully', async () => {
      const user = createMockUser();
      usersRepository.findOne.mockResolvedValue(user);

      const result = await service.updateEmail('john@example.com', {
        email: 'jane@example.com',
      });

      expect(result.error).toBe(false);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(auditRepository.logAudit).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid email format', async () => {
      await expect(
        service.updateEmail('invalid-email', { email: 'jane@example.com' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateEmail('john@example.com', { email: 'jane@example.com' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when new email equals current email', async () => {
      const user = createMockUser();
      usersRepository.findOne.mockResolvedValue(user);

      await expect(
        service.updateEmail('john@example.com', { email: 'john@example.com' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      const user = createMockUser();
      usersRepository.findOne.mockResolvedValue(user);

      const result = await service.updatePassword('john@example.com', {
        new_password: 'NewPassword123!',
      });

      expect(result.error).toBe(false);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException when new password equals old password', async () => {
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

      const user = createMockUser();
      usersRepository.findOne.mockResolvedValue(user);

      await expect(
        service.updatePassword('john@example.com', {
          new_password: 'old_password',
        }),
      ).rejects.toThrow(BadRequestException);

      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updatePassword('john@example.com', {
          new_password: 'NewPassword123!',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should toggle user status and log audit', async () => {
      const user = createMockUser({ is_active: true });
      usersRepository.findOne.mockResolvedValue(user);

      const result = await service.updateStatus('john@example.com', {
        status: true,
      });

      expect(result.error).toBe(false);
      expect(user.is_active).toBe(false);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(auditRepository.logAudit).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateStatus('john@example.com', { status: true }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAll', () => {
    it('should return paginated users', async () => {
      const user = createMockUser();
      usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder());
      const qb = usersRepository.createQueryBuilder() as unknown as {
        getCount: jest.Mock;
        getMany: jest.Mock;
      };
      qb.getCount.mockResolvedValue(1);
      qb.getMany.mockResolvedValue([user]);

      const pageOptions = {
        page: 1,
        limit: 10,
        order: 'ASC' as const,
        order_by: 'created_at',
        skip: 0,
        search: undefined,
        status: undefined,
      } as unknown as PageOptions;

      const result = await service.getAll(pageOptions);

      expect(result.error).toBe(false);
      expect(result.data).toBeDefined();
      expect(result.data!.data).toHaveLength(1);
    });

    it('should throw BadRequestException for invalid order_by', async () => {
      usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder());
      const qb = usersRepository.createQueryBuilder() as unknown as {
        getCount: jest.Mock;
        getMany: jest.Mock;
      };
      qb.getCount.mockResolvedValue(0);
      qb.getMany.mockResolvedValue([]);

      const pageOptions = {
        page: 1,
        limit: 10,
        order: 'ASC' as const,
        order_by: 'invalid_column',
        skip: 0,
        search: undefined,
        status: undefined,
      } as unknown as PageOptions;

      await expect(service.getAll(pageOptions)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findByUserEmailAuth', () => {
    it('should return user with auth data', async () => {
      const user = createMockUser();
      usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder());
      const qb = usersRepository.createQueryBuilder() as unknown as {
        getOne: jest.Mock;
      };
      qb.getOne.mockResolvedValue(user);

      const result = await service.findByUserEmailAuth('john@example.com');

      expect(result).toBeDefined();
      expect(result!.error).toBe(false);
      expect(result!.data).toEqual(user);
    });

    it('should return null when user not found', async () => {
      usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder());
      const qb = usersRepository.createQueryBuilder() as unknown as {
        getOne: jest.Mock;
      };
      qb.getOne.mockResolvedValue(null);

      const result = await service.findByUserEmailAuth('john@example.com');
      expect(result).toBeNull();
    });

    it('should throw BadRequestException for invalid email', async () => {
      await expect(
        service.findByUserEmailAuth('invalid-email'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByUserEmail', () => {
    it('should return user data', async () => {
      const user = createMockUser();
      usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder());
      const qb = usersRepository.createQueryBuilder() as unknown as {
        getOne: jest.Mock;
      };
      qb.getOne.mockResolvedValue(user);

      const result = await service.findByUserEmail('john@example.com');

      expect(result!.error).toBe(false);
      expect(result!.data!).toEqual(user);
    });

    it('should throw NotFoundException when user not found', async () => {
      usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder());
      const qb = usersRepository.createQueryBuilder() as unknown as {
        getOne: jest.Mock;
      };
      qb.getOne.mockResolvedValue(null);

      await expect(service.findByUserEmail('john@example.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByUserId', () => {
    it('should return user by id', async () => {
      const user = createMockUser();
      usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder());
      const qb = usersRepository.createQueryBuilder() as unknown as {
        getOne: jest.Mock;
      };
      qb.getOne.mockResolvedValue(user);

      const result = await service.findByUserId(user.id);

      expect(result!.error).toBe(false);
      expect(result!.data!).toEqual(user);
    });

    it('should throw NotFoundException when user not found', async () => {
      usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder());
      const qb = usersRepository.createQueryBuilder() as unknown as {
        getOne: jest.Mock;
      };
      qb.getOne.mockResolvedValue(null);

      await expect(service.findByUserId('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteByUserEmail', () => {
    it('should delete user successfully', async () => {
      const user = createMockUser();
      usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder());
      const qb = usersRepository.createQueryBuilder() as unknown as {
        getOne: jest.Mock;
      };
      qb.getOne.mockResolvedValue(user);

      const result = await service.deleteByUserEmail('john@example.com');

      expect(result.error).toBe(false);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException when user not found', async () => {
      usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder());
      const qb = usersRepository.createQueryBuilder() as unknown as {
        getOne: jest.Mock;
      };
      qb.getOne.mockResolvedValue(null);

      await expect(
        service.deleteByUserEmail('john@example.com'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid email', async () => {
      await expect(service.deleteByUserEmail('invalid-email')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
