import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetsModule } from './modules/pets/pets.module';
import { VaccinationsModule } from './modules/vaccinations/vaccinations.module';
import { VaccinationrecordsModule } from './modules/vaccinationrecords/vaccinationrecords.module';
import { TreatmentsModule } from './modules/treatments/treatments.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './modules/prisma/prisma.service';

@Module({
  imports: [UsersModule, AuthModule, PetsModule, VaccinationsModule, VaccinationrecordsModule, TreatmentsModule, ActivitiesModule, ConsultationsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
