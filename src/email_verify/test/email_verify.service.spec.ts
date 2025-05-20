import { Test, TestingModule } from '@nestjs/testing';
import { EmailVerifyService } from '../email_verify.service';

describe('EmailVerifyService', () => {
  let service: EmailVerifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailVerifyService],
    }).compile();

    service = module.get<EmailVerifyService>(EmailVerifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
