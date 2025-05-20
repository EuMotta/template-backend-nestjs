import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerifyEntity } from 'src/db/entities/email_verify';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/db/entities/user.entity';
import { ApiResponseData } from 'src/interfaces/api';

@Injectable()
export class EmailVerifyService {
  constructor(
    @InjectRepository(EmailVerifyEntity)
    private readonly emailVerifyRepository: Repository<EmailVerifyEntity>,

    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async sendVerificationEmail(email: string): Promise<ApiResponseData<null>> {
    try {
      console.log('chegou');
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();

      if (!user) {
        throw new NotFoundException('Usuário não encontrado.');
      }

      const payload = { sub: user.id };
      const token = this.jwtService.sign(payload, { expiresIn: '20m' });

      const emailVerify = this.emailVerifyRepository.create({
        user: { id: user.id },
        token,
      });

      await this.emailVerifyRepository.save(emailVerify);

      return {
        error: false,
        message: `Verificação de email enviada!`,
        data: null,
      };
    } catch (error) {
      console.error('Erro ao enviar a verificação:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Ocorreu um erro interno no servidor.',
      );
    }
  }

  async verifyEmailToken(token: string): Promise<void> {
    try {
      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub;

      const emailVerify = await this.emailVerifyRepository.findOne({
        where: { token },
        relations: ['user'],
      });

      if (!emailVerify) {
        throw new NotFoundException('Token não encontrado.');
      }

      const user = emailVerify.user;
      user.is_email_verified = true;
      await this.usersRepository.save(user);

      await this.emailVerifyRepository.delete(emailVerify.id);
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }
}
