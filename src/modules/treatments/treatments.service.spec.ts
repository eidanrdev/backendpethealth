import { Test, TestingModule } from '@nestjs/testing';
import { TreatmentsService } from './treatments.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TreatmentsService', () => {
  let service: TreatmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TreatmentsService, PrismaService],
    }).compile();

    service = module.get<TreatmentsService>(TreatmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
