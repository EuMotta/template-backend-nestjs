import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from 'src/db/entities/address.entity';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './address.dto';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  /**
   * Cria um novo usuário no sistema.
   *
   * @param {CreateAddressDto} newAddress - Dados do usuário a ser criado.
   * @returns {Promise<ApiResponseSuccess>} resposta do endereço criado.
   * @throws {BadRequestException} Se os dados forem inválidos.
   * @throws {InternalServerErrorException} Se ocorrer um erro inesperado.
   */

  async create(
    userId: string,
    newAddress: CreateAddressDto,
  ): Promise<ApiResponseSuccess> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado.');
      }
      const existingAddress = await this.addressRepository.findOne({
        where: {
          user: { id: userId },
          street: newAddress.street,
          number: newAddress.number,
          zip_code: newAddress.zip_code,
        },
      });
  
      if (existingAddress) {
        throw new ConflictException('Endereço já cadastrado para este usuário.');
      }
      const address = this.addressRepository.create({
        ...newAddress,
        user,
      });

      await this.addressRepository.save(address);

      return {
        message: 'Endereço criado com sucesso',
        error: false,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('Erro ao criar endereço:', error);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao criar o endereço.',
      );
    }
  }
}
