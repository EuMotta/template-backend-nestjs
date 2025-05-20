import {
  ConflictException,
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateUserResponse,
  UpdateUserEmailResponse,
  UpdateUserPasswordResponse,
  UpdateUserResponse,
  UpdateUserStatusResponse,
  UserDto,
} from './user.dto';
import { hashSync, compareSync } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { ApiResponseData } from 'src/interfaces/api';
import { PageOptions } from 'src/db/pagination/page-options.dto';
import { Page } from 'src/db/pagination/page.dto';
import { PageMeta } from 'src/db/pagination/page-meta.dto';
import { AuditRepository } from 'src/audit/audit.repository';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';

/**
 * Serviço responsável pela gestão de usuários no sistema.
 *
 * Este serviço fornece métodos para criar, atualizar, buscar e listar usuários.
 */

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private auditRepository: AuditRepository,
  ) {}

  /**
   * Cria um novo usuário no sistema.
   *
   * @param {CreateUserResponse} newUser - Dados do usuário a ser criado.
   * @returns {Promise<ApiResponseData<CreateUserResponse>>} Detalhes do usuário criado.
   * @throws {ConflictException} Se o e-mail já estiver cadastrado.
   * @throws {BadRequestException} Se os dados forem inválidos.
   * @throws {InternalServerErrorException} Se ocorrer um erro inesperado.
   */

  async create(
    newUser: CreateUserResponse,
  ): Promise<ApiResponseData<CreateUserResponse>> {
    try {
      const userAlreadyRegistered = await this.findByUserEmailAuth(
        newUser.email,
      );
      if (userAlreadyRegistered) {
        throw new ConflictException('Email já cadastrado');
      }

      const dbUser = new UserEntity();
      dbUser.name = newUser.name;
      dbUser.last_name = newUser.last_name;
      dbUser.email = newUser.email;
      dbUser.password = newUser.password;

      const errors = await validate(dbUser);

      if (errors.length > 0) {
        const messages = errors
          .map((error) => {
            return error.constraints ? Object.values(error.constraints) : [];
          })
          .flat();

        throw new BadRequestException(messages);
      }
      dbUser.password = hashSync(newUser.password, 10);

      await this.usersRepository.save(dbUser);

      return {
        message: 'Usuário criado com sucesso',
        error: false,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('Erro ao criar usuário:', error);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao criar o usuário',
      );
    }
  }

  /**
   * Atualiza os dados de um usuário pelo e-mail.
   *
   * @param {string} email - E-mail do usuário a ser atualizado.
   * @param {UpdateUserResponse} data - Novos dados do usuário.
   * @returns {Promise<ApiResponseData<UpdateUserResponse>>} Detalhes do usuário atualizado.
   * @throws {NotFoundException} Se o usuário não for encontrado.
   * @throws {BadRequestException} Se os dados forem inválidos.
   * @throws {InternalServerErrorException} Se ocorrer um erro inesperado.
   */

  async update(
    email: string,
    data: UpdateUserResponse,
  ): Promise<ApiResponseData<UpdateUserResponse>> {
    try {
      const userToUpdate = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();

      if (!userToUpdate) {
        throw new NotFoundException('Usuário não encontrado');
      }

      userToUpdate.name = data.name ?? userToUpdate.name;
      userToUpdate.last_name = data.last_name ?? userToUpdate.last_name;
      userToUpdate.image = data.image ?? userToUpdate.image;

      if (data.password) {
        userToUpdate.password = hashSync(data.password, 10);
      }

      const errors = await validate(userToUpdate);

      if (errors.length > 0) {
        const messages = errors
          .map((error) =>
            error.constraints ? Object.values(error.constraints) : [],
          )
          .flat();

        throw new BadRequestException(messages);
      }

      await this.usersRepository.save(userToUpdate);

      return {
        error: false,
        message: 'Usuário atualizado com sucesso!',
        data: null,
      };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Ocorreu um erro ao atualizar o usuário',
      );
    }
  }

  /**
   * Atualiza o e-mail de um usuário.
   *
   * @param {string} userEmail - E-mail atual do usuário.
   * @param {UpdateUserEmailResponse} data - Novo e-mail do usuário.
   * @returns {Promise<ApiResponseData<UpdateUserEmailResponse>>} Confirmação da atualização.
   * @throws {NotFoundException} Se o usuário não for encontrado.
   * @throws {ConflictException} Se o novo e-mail já estiver em uso.
   * @throws {BadRequestException} Se o e-mail for inválido.
   * @throws {InternalServerErrorException} Se ocorrer um erro inesperado.
   */

  async updateEmail(
    userEmail: string,
    data: UpdateUserEmailResponse,
  ): Promise<ApiResponseData<UpdateUserEmailResponse>> {
    try {
      console.log(userEmail);
      console.log(data);
      if (!this.isValidEmail(userEmail)) {
        throw new BadRequestException('Formato de email inválido');
      }

      if (!userEmail) {
        throw new BadRequestException('Insira o email atual');
      }
      if (!data.email) {
        throw new BadRequestException('Insira um novo email');
      }
      const userToUpdate = await this.usersRepository.findOne({
        where: { email: userEmail },
      });

      if (!userToUpdate) {
        throw new NotFoundException('Usuário não encontrado');
      }

      if (data.email === userToUpdate.email) {
        throw new BadRequestException('O novo email é igual ao email atual');
      }
      const oldData = userToUpdate.email;
      if (data.email) {
        userToUpdate.email = data.email;
      }

      const errors = await validate(userToUpdate);
      if (errors.length > 0) {
        const messages = errors
          .map((error) => Object.values(error.constraints || {}))
          .flat();
        throw new BadRequestException(messages);
      }

      await this.usersRepository.save(userToUpdate);

      await this.auditRepository.logAudit({
        user_id: userToUpdate.id,
        method: 'PATCH',
        path: `/users/update_status/${userToUpdate.email}`,
        old_data: oldData,
        new_data: userToUpdate.email,
      });

      return {
        error: false,
        message: `Email atualizado com sucesso!`,
        data: null,
      };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);

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

  /**
   * Atualiza o e-mail de um usuário.
   *
   * @param {string} userEmail - E-mail atual do usuário.
   * @param {UpdateUserEmailResponse} data - Novo e-mail do usuário.
   * @returns {Promise<ApiResponseData<UpdateUserEmailResponse>>} Confirmação da atualização.
   * @throws {NotFoundException} Se o usuário não for encontrado.
   * @throws {ConflictException} Se o novo e-mail já estiver em uso.
   * @throws {BadRequestException} Se o e-mail for inválido.
   * @throws {InternalServerErrorException} Se ocorrer um erro inesperado.
   */

  async updatePassword(
    userEmail: string,
    data: UpdateUserPasswordResponse,
  ): Promise<ApiResponseData<UpdateUserPasswordResponse>> {
    try {
      if (!this.isValidEmail(userEmail)) {
        throw new BadRequestException('Formato de email inválido');
      }

      if (!data.new_password) {
        throw new BadRequestException('Insira a nova senha');
      }

      const userToUpdate = await this.usersRepository.findOne({
        where: { email: userEmail },
      });

      if (!userToUpdate) {
        throw new NotFoundException('Usuário não encontrado');
      }

      if (compareSync(data.new_password, userToUpdate.password)) {
        throw new BadRequestException('As senhas são iguais');
      }

      if (data.new_password) {
        userToUpdate.password = hashSync(data.new_password, 10);
      }

      await this.usersRepository.save(userToUpdate);

      const errors = await validate(userToUpdate);
      if (errors.length > 0) {
        const messages = errors
          .map((error) => Object.values(error.constraints || {}))
          .flat();
        throw new BadRequestException(messages);
      }

      await this.usersRepository.save(userToUpdate);

      return {
        error: false,
        message: `Senha atualizada com sucesso!`,
        data: null,
      };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);

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

  /**
   * Atualiza o status de um usuário (ativo/inativo).
   *
   * @param {string} userEmail - E-mail do usuário a ser atualizado.
   * @param {UpdateUserStatusResponse} data - Novo status do usuário.
   * @returns {Promise<ApiResponseData<UpdateUserStatusResponse>>} Confirmação da atualização.
   * @throws {NotFoundException} Se o usuário não for encontrado.
   * @throws {BadRequestException} Se os dados forem inválidos.
   * @throws {InternalServerErrorException} Se ocorrer um erro inesperado.
   */

  async updateStatus(
    userEmail: string,
    data: UpdateUserStatusResponse,
  ): Promise<ApiResponseData<UpdateUserStatusResponse>> {
    try {
      const userToUpdate = await this.usersRepository.findOne({
        where: { email: userEmail },
      });

      if (!userToUpdate) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const oldData = userToUpdate.is_active;

      if (data.status === true) {
        userToUpdate.is_active = !userToUpdate.is_active;
      }

      const errors = await validate(userToUpdate);
      if (errors.length > 0) {
        const messages = errors
          .map((error) => Object.values(error.constraints || {}))
          .flat();
        throw new BadRequestException(messages);
      }

      await this.usersRepository.save(userToUpdate);

      await this.auditRepository.logAudit({
        user_id: userToUpdate.id,
        method: 'PATCH',
        path: `/users/update_status/${userToUpdate.email}`,
        old_data: oldData,
        new_data: userToUpdate.is_active,
      });

      return {
        error: false,
        message: `Usuário ${userToUpdate.is_active ? 'Ativado' : 'Desativado'} com sucesso!`,
        data: null,
      };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro ao atualizar o usuário:',
        error,
      );
    }
  }

  /**
   * Obtém uma lista paginada de usuários do sistema.
   *
   * @param {PageOptions} pageOptionsDto - Opções de paginação e filtros de pesquisa.
   * @returns {Promise<ApiResponseData<Page<UserDto>>>} Lista paginada de usuários.
   * @throws {BadRequestException} Se os filtros forem inválidos.
   * @throws {InternalServerErrorException} Se ocorrer um erro inesperado.
   */

  async getAll(
    pageOptions: PageOptions,
  ): Promise<ApiResponseData<Page<UserDto>>> {
    try {
      const { page, limit, search, status, order, orderBy } = pageOptions;
      const offset = (page - 1) * limit;

      const queryBuilder = this.usersRepository
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.name',
          'user.last_name',
          'user.email',

          'user.is_email_verified',
          'user.image',
          'user.is_active',
          'user.created_at',
          'user.is_banned',
        ])
        .limit(limit)
        .offset(offset);

      if (search) {
        queryBuilder.andWhere(
          '(user.name LIKE :search OR user.email LIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (status) {
        const isActive = status === 'true';
        queryBuilder.andWhere('user.is_active = :status', { status: isActive });
      }

      if (orderBy) {
        const validColumns = ['name', 'last_name', 'email', 'created_at'];
        if (!validColumns.includes(orderBy)) {
          throw new BadRequestException(
            `Campo de ordenação inválido: ${orderBy}`,
          );
        }
        queryBuilder.orderBy(`user.${orderBy}`, order || 'ASC');
      } else {
        queryBuilder.orderBy('user.created_at', order || 'ASC');
      }

      const itemCount = await queryBuilder.getCount();
      const data = await queryBuilder.getMany();

      const pageMetaDto = new PageMeta({ itemCount, pageOptions });
      const pageDto = new Page(data, pageMetaDto);

      return {
        error: false,
        message: 'Usuários encontrados com sucesso!',
        data: pageDto,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('Erro ao procurar lista de usuários:', error);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao procurar os usuários',
      );
    }
  }

  /**
   * Busca um usuário pelo e-mail, incluindo dados de autenticação.
   *
   * @param {string} email - E-mail do usuário.
   * @returns {Promise<ApiResponseData<UserDto | null> | null>} Detalhes do usuário encontrado ou null se não existir.
   * @throws {BadRequestException} Se o formato do e-mail for inválido.
   */

  async findByUserEmailAuth(
    email: string,
  ): Promise<ApiResponseData<UserDto | null> | null> {
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Formato de email inválido');
    }

    const userFound = await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.last_name',
        'user.email',
        'user.image',

        'user.is_active',
        'user.created_at',
        'user.is_banned',
        'user.password',
      ])
      .where('user.email = :email', { email })
      .getOne();

    if (!userFound) {
      return null;
    }

    return {
      error: false,
      message: 'Usuário encontrado com sucesso!',
      data: userFound,
    };
  }

  /**
   * Busca um usuário pelo e-mail.
   *
   * @param {string} email - E-mail do usuário.
   * @returns {Promise<ApiResponseData<UserDto | null> | null>} Detalhes do usuário encontrado ou null se não existir.
   * @throws {BadRequestException} Se o formato do e-mail for inválido.
   */

  async findByUserEmail(
    email: string,
  ): Promise<ApiResponseData<UserDto | null> | null> {
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Formato de email inválido');
    }

    const userFound = await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.last_name',
        'user.email',
        'user.is_email_verified',
        'user.image',
        'user.is_active',
        'user.created_at',
        'user.is_banned',
      ])
      .where('user.email = :email', { email })
      .getOne();

    if (!userFound) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      error: false,
      message: 'Usuário encontrado com sucesso!',
      data: userFound,
    };
  }
  async findByUserId(
    id: string,
  ): Promise<ApiResponseData<UserDto | null> | null> {
    const userFound = await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.last_name',
        'user.email',
        'user.is_email_verified',
        'user.image',
        'user.is_active',
        'user.created_at',
        'user.is_banned',
      ])
      .where('user.id = :id', { id })
      .getOne();

    if (!userFound) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      error: false,
      message: 'Usuário encontrado com sucesso!',
      data: userFound,
    };
  }

  /**
   * Busca um usuário pelo e-mail.
   *
   * @param {string} email - E-mail do usuário.
   * @returns {Promise<ApiResponseData<UserDto | null> | null>} Detalhes do usuário encontrado ou null se não existir.
   * @throws {BadRequestException} Se o formato do e-mail for inválido.
   */

  async deleteByUserEmail(email: string): Promise<ApiResponseSuccess> {
    try {
      if (!this.isValidEmail(email)) {
        throw new BadRequestException('Formato de email inválido');
      }

      const userFound = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();

      if (!userFound) {
        throw new NotFoundException('Usuário não encontrado');
      }

      await this.usersRepository.remove(userFound);

      return {
        error: false,
        message: 'Usuário deletado com sucesso!',
      };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro ao atualizar o usuário:',
        error,
      );
    }
  }

  /**
   * Valida se um endereço de e-mail possui um formato válido.
   *
   * @param {string} email - E-mail a ser validado.
   * @returns {boolean} True se o e-mail for válido, False caso contrário.
   */

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
