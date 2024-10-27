import { Module } from '@nestjs/common';
import { VaccinationrecordService } from './vaccinationrecords.service';
import { VaccinationrecordController } from './vaccinationrecords.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [VaccinationrecordController],
  providers: [VaccinationrecordService, PrismaService],
})
export class VaccinationrecordsModule {}
