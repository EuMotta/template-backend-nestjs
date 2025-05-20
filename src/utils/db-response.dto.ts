import { ApiProperty } from '@nestjs/swagger';
import { Page } from 'src/db/pagination/page.dto';

export class ApiResponseSuccess {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Lista obtida com sucesso!' })
  message: string;
}

export class ApiResponseBasePaginated<T> {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Lista obtida com sucesso!' })
  message: string;

  @ApiProperty()
  data: Page<T> | undefined;

  constructor(error: boolean, message: string, data?: Page<T>) {
    this.error = error;
    this.message = message;
    this.data = data;
  }
}

export class ErrorResponseDto {
  @ApiProperty({
    example: false,
    description: 'Indica se o erro ocorreu ou não',
  })
  error: boolean;

  @ApiProperty({
    example: 'Usuário não encontrado',
    description: 'Mensagem explicando o erro',
  })
  message: string;
}

export class AxiosErrorInnerResponseDto {
  @ApiProperty({
    description: 'Dados do erro',
    type: ErrorResponseDto,
  })
  data: ErrorResponseDto;
}

export class AxiosErrorResponse {
  @ApiProperty({
    example: 'Usuário não encontrado',
    description: 'Mensagem explicando o erro',
  })
  message: string;

  @ApiProperty({
    description: 'Objeto de resposta do erro',
    type: AxiosErrorInnerResponseDto,
  })
  response: AxiosErrorInnerResponseDto;
}
