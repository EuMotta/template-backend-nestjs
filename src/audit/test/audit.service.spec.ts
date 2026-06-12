import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from '../audit.service';
import { AuditRepository } from '../audit.repository';

const mockAuditRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

describe('AuditService', () => {
  let service: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: AuditRepository, useFactory: mockAuditRepo },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
