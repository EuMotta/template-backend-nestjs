import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check / API status' })
  @ApiResponse({ status: 200, description: 'API is running' })
  getStatus(): { status: string } {
    return this.appService.getStatus();
  }
}
