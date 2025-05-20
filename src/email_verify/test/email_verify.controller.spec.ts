import { Test, TestingModule } from '@nestjs/testing';
import { EmailVerifyController } from '../email_verify.controller';

describe('EmailVerifyController', () => {
  let controller: EmailVerifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailVerifyController],
    }).compile();

    controller = module.get<EmailVerifyController>(EmailVerifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
