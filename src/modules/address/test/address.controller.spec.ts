import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from '../address.controller';
import { AddressService } from '../address.service';
import { AuthGuard } from '../../auth/auth.guard';

const mockAddressService = () => ({
  create: jest.fn(),
  findByUser: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('AddressController', () => {
  let controller: AddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [{ provide: AddressService, useFactory: mockAddressService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AddressController>(AddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
