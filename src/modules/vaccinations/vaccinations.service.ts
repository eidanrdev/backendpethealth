import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@ApiTags('vaccinations')
@Injectable()
export class VaccinationsService {
  constructor(private prisma: PrismaService) {}

  async create(createVaccinationDto: CreateVaccinationDto, user: User) {
    const { name, applicationDate, weight, petId, vaccinationRecordId } = createVaccinationDto;
  
    // Verifica si la mascota pertenece al usuario o si el usuario es ADMIN
    const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) {
      throw new NotFoundException(`Mascota con ID ${petId} no encontrada`);
    }
    if (pet.userid !== user.id && user.role !== 'ADMIN') {
      throw new BadRequestException('No tienes permiso para crear una vacunación para esta mascota');
    }
  
    // Verifica si el registro de vacunación existe
    const vaccinationRecord = await this.prisma.vaccinationRecord.findUnique({ where: { id: vaccinationRecordId } });
    if (!vaccinationRecord) {
      throw new NotFoundException(`Registro de vacuna con ID ${vaccinationRecordId} no encontrado`);
    }
  
    // Convierte la fecha de aplicación a un objeto Date en UTC
    const parsedApplicationDate = new Date(applicationDate);
    const currentDate = new Date();
  
    // Ajusta ambas fechas a medianoche en UTC para comparación
    parsedApplicationDate.setUTCHours(0, 0, 0, 0); // Establece la fecha de aplicación a 00:00:00 UTC
    currentDate.setUTCHours(0, 0, 0, 0); // Establece la fecha actual a 00:00:00 UTC
  
    // Comparar las fechas
    if (parsedApplicationDate.getTime() !== currentDate.getTime()) {
      throw new BadRequestException('La fecha de aplicación debe ser igual a la fecha de hoy');
    }
  
    // Crear la vacunación
    const vaccination = await this.prisma.vaccination.create({
      data: {
        name,
        applicationDate: parsedApplicationDate,
        weight: new Decimal(weight).toNumber().toFixed(2),
        petId,
        vaccinationRecordId,
      },
    });
  
    return {
      message: 'Vacuna creada exitosamente',
      vaccination,
    };
  }
  

  async findOne(id: number, user: User) {
    const vaccination = await this.prisma.vaccination.findUnique({
      where: { id },
      include: {
        pet: true,
        vaccinationRecord: true,
      },
    });

    if (!vaccination) {
      throw new NotFoundException(`Vacuna con ID ${id} no encontrada`);
    }

    // Verifica si el usuario tiene permiso para acceder a la vacunación
    if (vaccination.pet.userid !== user.id && user.role !== 'ADMIN') {
      throw new BadRequestException('No tienes permiso para acceder a esta vacunación');
    }

    return {
      message: 'Vacuna encontrada',
      vaccination,
    };
  }

  async findAll(user: User) {
    if (user.role === 'ADMIN') {
      const vaccinations = await this.prisma.vaccination.findMany({
        include: {
          pet: true,
          vaccinationRecord: true,
        },
      });
      return {
        message: 'Vacunas encontradas',
        vaccinations,
      };
    } else {
      const vaccinations = await this.prisma.vaccination.findMany({
        where: {
          pet: {
            userid: user.id,
          },
        },
        include: {
          pet: true,
          vaccinationRecord: true,
        },
      });
      return {
        message: 'Tus vacunas encontradas',
        vaccinations,
      };
    }
  }

  async update(id: number, updateVaccinationDto: UpdateVaccinationDto, user: User) {
    const { name, applicationDate, weight, petId, vaccinationRecordId } = updateVaccinationDto;
  
    const vaccination = await this.prisma.vaccination.findUnique({ where: { id } });
    if (!vaccination) {
      throw new NotFoundException(`Vacuna con ID ${id} no encontrada`);
    }
  
    const pet = await this.prisma.pet.findUnique({
      where: { id: vaccination.petId },
      include: { user: { select: { id: true, role: true } } },
    });
  
    // Verifica si el usuario tiene permiso para actualizar la vacunación
    if (pet.user.id !== user.id && user.role !== 'ADMIN') {
      throw new BadRequestException('No tienes permiso para actualizar esta vacunación');
    }
  
    if (petId !== undefined) {
      const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
      if (!pet) {
        throw new NotFoundException(`Mascota con ID ${petId} no encontrada`);
      }
    }
  
    if (vaccinationRecordId !== undefined) {
      const vaccinationRecord = await this.prisma.vaccinationRecord.findUnique({ where: { id: vaccinationRecordId } });
      if (!vaccinationRecord) {
        throw new NotFoundException(`Registro de vacuna con ID ${vaccinationRecordId} no encontrado`);
      }
    }
  
    const data: any = {};
  
    if (name !== undefined) {
      data.name = name;
    }
  
    if (applicationDate !== undefined) {
      const parsedApplicationDate = new Date(applicationDate);
      const currentDate = new Date();
  
      // Normaliza las fechas a solo la parte de la fecha (sin horas)
      const normalizedCurrentDate = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()));
      const normalizedApplicationDate = new Date(Date.UTC(parsedApplicationDate.getUTCFullYear(), parsedApplicationDate.getUTCMonth(), parsedApplicationDate.getUTCDate()));
  
      // Verifica si la fecha de aplicación es igual a la fecha actual
      if (normalizedApplicationDate.getTime() !== normalizedCurrentDate.getTime()) {
        throw new BadRequestException('La fecha de aplicación debe ser igual a la fecha de hoy');
      }
  
      data.applicationDate = parsedApplicationDate; // Aquí se guarda la fecha original
    }
  
    if (weight !== undefined) {
      // Asegúrate de que weight es un número y luego convierte a Decimal
      const weightValue = parseFloat(weight.toString()).toFixed(2); // Limita a 2 decimales
      data.weight = (weightValue); // Crea el Decimal a partir del valor formateado
    }
  
    if (petId !== undefined) {
      data.petId = petId;
    }
  
    if (vaccinationRecordId !== undefined) {
      data.vaccinationRecordId = vaccinationRecordId;
    }
  
    const updatedVaccination = await this.prisma.vaccination.update({
      where: { id },
      data: {
        ...data,
      },
    });
  
    return {
      message: 'Vacuna actualizada exitosamente',
      vaccination: updatedVaccination,
    };
  }
  

  async delete(id: number, user: User) {
    const vaccination = await this.prisma.vaccination.findUnique({ where: { id } });
    if (!vaccination) {
      throw new NotFoundException(`Vacuna con ID ${id} no encontrada`);
    }
    const pet = await this.prisma.pet.findUnique({
      where: { id: vaccination.petId },
      include: { user: { select: { id: true, role: true } } },
    });
    // Verifica si el usuario tiene permiso para eliminar la vacunación
    if (pet.user.id !== user.id && user.role !== 'ADMIN') {
      throw new BadRequestException('No tienes permiso para eliminar esta vacunación');
    }

    await this.prisma.vaccination.delete({ where: { id } });
    return {
      message: 'Vacuna eliminada exitosamente',
      vaccination,
    };
  }
}
