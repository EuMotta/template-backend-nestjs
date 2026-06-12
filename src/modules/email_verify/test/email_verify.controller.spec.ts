import { Test, TestingModule } from '@nestjs/testing';
import { EmailVerifyController } from '../email_verify.controller';
import { EmailVerifyService } from '../email_verify.service';

const mockEmailVerifyService = () => ({
  sendVerificationEmail: jest.fn(),
  verifyEmailToken: jest.fn(),
});

describe('EmailVerifyController', () => {
  let controller: EmailVerifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailVerifyController],
      providers: [
        { provide: EmailVerifyService, useFactory: mockEmailVerifyService },
      ],
    }).compile();

    controller = module.get<EmailVerifyController>(EmailVerifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
