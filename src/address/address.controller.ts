import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';
import { AxiosErrorResponse } from 'src/utils/db-response.dto';
import { CreateAddressDto } from './address.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { TokenPayload } from 'src/interfaces/token.interface';

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
}
