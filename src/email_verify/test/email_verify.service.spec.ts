import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { EmailVerifyService } from '../email_verify.service';
import { EmailVerifyEntity } from '../../db/entities/email_verify';
import { UserEntity } from '../../db/entities/user.entity';
import { Repository } from 'typeorm';

const mockEmailVerifyRepo = () => ({
  create: jest.fn().mockImplementation((data: Record<string, unknown>) => ({
    ...data,
    id: 'verify-id',
  })),
  save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
  findOne: jest.fn(),
  delete: jest.fn().mockResolvedValue(undefined),
});

const mockUsersRepo = () => ({
  save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  }),
});

const mockJwtService = () => ({
  sign: jest.fn().mockReturnValue('mocked-verify-token'),
  verify: jest.fn().mockReturnValue({ sub: 'user-id' }),
});

const createMockUser = (overrides: Partial<UserEntity> = {}): UserEntity => {
  const user = new UserEntity();
  user.id = 'user-id';
  user.name = 'John';
  user.last_name = 'Motta';
  user.email = 'john@example.com';
  user.is_active = true;
  user.is_banned = false;
  user.is_email_verified = false;
  user.role = 'USER';
  Object.assign(user, overrides);
  return user;
};

describe('EmailVerifyService', () => {
  let service: EmailVerifyService;
  let emailVerifyRepository: jest.Mocked<Repository<EmailVerifyEntity>>;
  let usersRepository: jest.Mocked<Repository<UserEntity>>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailVerifyService,
        {
          provide: getRepositoryToken(EmailVerifyEntity),
          useFactory: mockEmailVerifyRepo,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: mockUsersRepo,
        },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = module.get<EmailVerifyService>(EmailVerifyService);
    emailVerifyRepository = module.get(getRepositoryToken(EmailVerifyEntity));
    usersRepository = module.get(getRepositoryToken(UserEntity));
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendVerificationEmail', () => {
    it('should create and save verification token', async () => {
      const user = createMockUser();
      const qb = usersRepository.createQueryBuilder() as unknown as {
        getOne: jest.Mock;
      };
      qb.getOne.mockResolvedValue(user);

      const result = await service.sendVerificationEmail('john@example.com');

      expect(result.error).toBe(false);
      expect(result.message).toBe('Verificação de email enviada!');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(emailVerifyRepository.create).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(emailVerifyRepository.save).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: user.id },
        { expiresIn: '20m' },
      );
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const qb = usersRepository.createQueryBuilder() as unknown as {
        getOne: jest.Mock;
      };
      qb.getOne.mockResolvedValue(null);

      await expect(
        service.sendVerificationEmail('john@example.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('verifyEmailToken', () => {
    it('should verify email and delete token', async () => {
      const user = createMockUser();
      const emailVerify = {
        id: 'verify-id',
        token: 'mocked-verify-token',
        user,
      } as unknown as EmailVerifyEntity;

      emailVerifyRepository.findOne.mockResolvedValue(emailVerify);
      jwtService.verify.mockReturnValue({ sub: 'user-id' });

      await service.verifyEmailToken('mocked-verify-token');

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ is_email_verified: true }),
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(emailVerifyRepository.delete).toHaveBeenCalledWith('verify-id');
    });

    it('should throw UnauthorizedException when token is not found', async () => {
      emailVerifyRepository.findOne.mockResolvedValue(null);
      jwtService.verify.mockReturnValue({ sub: 'user-id' });

      await expect(service.verifyEmailToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user id does not match', async () => {
      const user = createMockUser({ id: 'different-id' });
      const emailVerify = {
        id: 'verify-id',
        token: 'mocked-verify-token',
        user,
      } as unknown as EmailVerifyEntity;

      emailVerifyRepository.findOne.mockResolvedValue(emailVerify);
      jwtService.verify.mockReturnValue({ sub: 'user-id' });

      await expect(
        service.verifyEmailToken('mocked-verify-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when jwt verify fails', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      await expect(service.verifyEmailToken('expired-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
