import { Test, TestingModule } from '@nestjs/testing';
import { VaccinationrecordService } from './vaccinationrecords.service';
import { PrismaService } from '../prisma/prisma.service';

describe('VaccinationrecordsService', () => {
  let service: VaccinationrecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VaccinationrecordService, PrismaService],
    }).compile();

    service = module.get<VaccinationrecordService>(VaccinationrecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
