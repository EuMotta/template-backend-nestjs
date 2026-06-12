import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { UserAuthDto } from '../../users/user.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compareSync: jest.fn().mockReturnValue(true),
}));

const mockUsersService = () => ({
  findByUserEmailAuth: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn().mockReturnValue('mocked-jwt-token'),
});

const mockConfigService = () => ({
  get: jest.fn().mockReturnValue('3600'),
});

const createMockUser = () => ({
  id: 'a3e1f9c7-d2a1-41f0-9f9e-b86cb78a6ec3',
  name: 'John',
  last_name: 'Motta',
  email: 'john@example.com',
  password: 'hashed_password',
  is_active: true,
  is_banned: false,
  role: 'USER',
});

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useFactory: mockUsersService },
        { provide: JwtService, useFactory: mockJwtService },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should authenticate and return token', async () => {
      const user = createMockUser();
      usersService.findByUserEmailAuth.mockResolvedValue({
        error: false,
        message: 'Usuário encontrado com sucesso!',
        data: user as unknown as UserAuthDto,
      });

      const result = await service.signIn('john@example.com', 'Password123!');

      expect(result.error).toBe(false);
      expect(result.message).toBe('Login realizado com sucesso');
      expect(result.data.token).toBe('mocked-jwt-token');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
    });

    it('should throw BadRequestException for invalid email format', async () => {
      await expect(
        service.signIn('invalid-email', 'Password123!'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersService.findByUserEmailAuth.mockResolvedValue(null);

      await expect(
        service.signIn('john@example.com', 'Password123!'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      const user = createMockUser();
      usersService.findByUserEmailAuth.mockResolvedValue({
        error: false,
        message: 'Usuário encontrado com sucesso!',
        data: user as unknown as UserAuthDto,
      });

      await expect(
        service.signIn('john@example.com', 'WrongPassword123!'),
      ).rejects.toThrow(UnauthorizedException);

      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
    });

    it('should throw UnauthorizedException when account is inactive', async () => {
      const user = createMockUser();
      user.is_active = false;
      usersService.findByUserEmailAuth.mockResolvedValue({
        error: false,
        message: 'Usuário encontrado com sucesso!',
        data: user as unknown as UserAuthDto,
      });

      await expect(
        service.signIn('john@example.com', 'Password123!'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when account is banned', async () => {
      const user = createMockUser();
      user.is_banned = true;
      usersService.findByUserEmailAuth.mockResolvedValue({
        error: false,
        message: 'Usuário encontrado com sucesso!',
        data: user as unknown as UserAuthDto,
      });

      await expect(
        service.signIn('john@example.com', 'Password123!'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
