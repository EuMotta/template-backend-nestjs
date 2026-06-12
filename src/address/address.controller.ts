import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import {
  ApiResponseSuccess,
  AxiosErrorResponse,
} from 'src/utils/db-response.dto';
import { CreateAddressDto, UpdateAddressDto } from './address.dto';
import { GetUser } from '../decorators/get-user.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { TokenPayload } from '../interfaces/token.interface';
import { ApiResponseData } from '../interfaces/api';

@UseGuards(AuthGuard)
@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cria um novo endereço',
    operationId: 'createAddress',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Endereço criado',
    type: ApiResponseSuccess,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
    type: AxiosErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: AxiosErrorResponse,
  })
  @ApiBody({ type: CreateAddressDto })
  async create(
    @Body() addressData: CreateAddressDto,
    @GetUser() user: TokenPayload,
  ): Promise<ApiResponseSuccess> {
    return this.addressService.create(user.sub, addressData);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar endereços do usuário autenticado' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de endereços' })
  async findByUser(
    @GetUser() user: TokenPayload,
  ): Promise<ApiResponseData<unknown[]>> {
    return this.addressService.findByUser(user.sub);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar endereço' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Endereço atualizado' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Endereço não encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateAddressDto,
    @GetUser() user: TokenPayload,
  ): Promise<ApiResponseSuccess> {
    return this.addressService.update(user.sub, id, data);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deletar endereço' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Endereço deletado' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Endereço não encontrado',
  })
  async delete(
    @Param('id') id: string,
    @GetUser() user: TokenPayload,
  ): Promise<ApiResponseSuccess> {
    return this.addressService.delete(user.sub, id);
  }
}
