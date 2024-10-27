import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVaccinationrecordDto } from './dto/create-vaccinationrecord.dto';
import { UpdateVaccinationrecordDto } from './dto/update-vaccinationrecord.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { VaccinationRecord, User } from '@prisma/client'; 

function calculateAgeInMonths(birthDate: Date): number {
  const today = new Date();
  const birth = new Date(birthDate);

  let ageInMonths = (today.getMonth() - birth.getMonth()) + (12 * (today.getFullYear() - birth.getFullYear()));

  if (today.getDate() < birth.getDate()) {
    ageInMonths--;
  }

  return ageInMonths;
}

@ApiTags('Registros de Vacunación')
@Injectable()
export class VaccinationrecordService {
  constructor(private prisma: PrismaService) {}

  @ApiOperation({ summary: 'Crear un nuevo registro de vacunación' })
  @ApiResponse({ status: 201, description: 'Registro de vacunación creado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada.' })
  @ApiResponse({ status: 400, description: 'Error en la solicitud, los datos enviados son inválidos.' })
  async create(createVaccinationDto: CreateVaccinationrecordDto, user: User): Promise<{ message: string; vaccinationRecord: VaccinationRecord }> {
    const { recordType, petId } = createVaccinationDto;
  
    // Verificar si la mascota existe
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
      include: { user: true }, // Incluir el usuario para verificar la propiedad
    });
    
    if (!pet) {
      throw new NotFoundException(`Mascota con ID ${petId} no encontrada`);
    }
  
    // Verificar si el usuario es ADMIN o si es el dueño de la mascota
    if (user.role !== 'ADMIN' && pet.userid !== user.id) {
      throw new BadRequestException('No tienes permiso para crear un registro de vacunación para esta mascota');
    }
  
    // Verificar la especie y el tipo de registro
    if (pet.species === 'Perro') {
      if (recordType !== 'adulto' && recordType !== 'cachorro') {
        throw new BadRequestException('El tipo de registro debe ser adulto o cachorro');
      }
      const ageInMonths = calculateAgeInMonths(pet.birthDate);
      if (recordType === 'cachorro' && ageInMonths >= 12) {
        throw new BadRequestException('Solo se pueden registrar cachorros menores de 12 meses');
      }
      if (recordType === 'adulto' && ageInMonths < 12) {
        throw new BadRequestException('Solo se pueden registrar adultos mayores o iguales a 12 meses');
      }
      const existingRecord = await this.prisma.vaccinationRecord.findFirst({
        where: {
          petId,
          recordType,
        },
      });
      if (existingRecord) {
        throw new BadRequestException(`La mascota con ID ${petId} ya tiene una cartilla de ${recordType}`);
      }
    }
  
    if (pet.species === 'Gato') {
      if (recordType !== 'adulto' && recordType !== 'gatito') {
        throw new BadRequestException('El tipo de registro debe ser adulto o gatito');
      }
      const ageInMonths = calculateAgeInMonths(pet.birthDate);
      if (recordType === 'gatito' && ageInMonths >= 12) {
        throw new BadRequestException('Solo se pueden registrar gatitos menores de 12 meses');
      }
      if (recordType === 'adulto' && ageInMonths < 12) {
        throw new BadRequestException('Solo se pueden registrar adultos mayores o iguales a 12 meses');
      }
      const existingRecord = await this.prisma.vaccinationRecord.findFirst({
        where: {
          petId,
          recordType,
        },
      });
      if (existingRecord) {
        throw new BadRequestException(`La mascota con ID ${petId} ya tiene una cartilla de ${recordType}`);
      }
    }
  
    // Crear el registro de vacunación
    const vaccinationRecord = await this.prisma.vaccinationRecord.create({
      data: {
        recordType,
        petId,
      },
    });
  
    return {
      message: 'Registro de vacunación creado exitosamente',
      vaccinationRecord,
    };
  }
  

  @ApiOperation({ summary: 'Obtener todos los registros de vacunación del usuario o todos si es ADMIN' })
  @ApiResponse({ status: 200, description: 'Lista de registros de vacunación.' })
  async findAll(user: User) {
    if (user.role === 'ADMIN') {
      return this.prisma.vaccinationRecord.findMany();
    }
    return this.prisma.vaccinationRecord.findMany({
      where: {
        pet: {
          userid: user.id, 
        },
      },
    });
  }

  @ApiOperation({ summary: 'Obtener un registro de vacunación por ID' })
  @ApiResponse({ status: 200, description: 'Registro de vacunación encontrado.' })
  @ApiResponse({ status: 404, description: 'Registro de vacunación no encontrado.' })
  async findOneByUserOrAdmin(id: number, user: User): Promise<VaccinationRecord> {
    const vaccinationRecord = await this.prisma.vaccinationRecord.findUnique({
      where: { id },
      include: {
        pet: true,
        vaccinations: true,
      },
    });
    if (!vaccinationRecord) {
      throw new NotFoundException(`Registro de vacunación con ID ${id} no encontrado`);
    }

    if (user.role !== 'ADMIN' && vaccinationRecord.pet.userid !== user.id) {
      throw new BadRequestException('No tienes permiso para acceder a este registro');
    }

    return vaccinationRecord;
  }

  @ApiOperation({ summary: 'Actualizar un registro de vacunación por ID' })
  @ApiResponse({ status: 200, description: 'Registro de vacunación actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Registro de vacunación no encontrado.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  async updatePetByUserOrAdmin(id: number, updateVaccinationDto: UpdateVaccinationrecordDto, user: User): Promise<VaccinationRecord> {
    const vaccinationRecord = await this.prisma.vaccinationRecord.findUnique({
      where: { id },
      include: {
        pet: true,
      },
    });
    if (!vaccinationRecord) {
      throw new NotFoundException(`Registro de vacunación con ID ${id} no encontrado`);
    }

    if (user.role !== 'ADMIN' && vaccinationRecord.pet.userid !== user.id) {
      throw new BadRequestException('No tienes permiso para actualizar este registro');
    }

    const { recordType, petId } = updateVaccinationDto;
    const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) {
      throw new NotFoundException(`Mascota con ID ${petId} no encontrada`);
    }

    if (pet.species === 'Perro') {
      if (recordType !== 'adulto' && recordType !== 'cachorro') {
        throw new BadRequestException('El tipo de registro debe ser adulto o cachorro');
      }
      const ageInMonths = calculateAgeInMonths(pet.birthDate);
      if (recordType === 'cachorro' && ageInMonths >= 12) {
        throw new BadRequestException('Solo se pueden registrar cachorros menores de 12 meses');
      }
      if (recordType === 'adulto' && ageInMonths < 12) {
        throw new BadRequestException('Solo se pueden registrar adultos mayores o iguales a 12 meses');
      }
      const existingRecord = await this.prisma.vaccinationRecord.findFirst({
        where: {
          petId,
          recordType,
        },
      });
      if (existingRecord) {
        throw new BadRequestException(`La mascota con ID ${petId} ya tiene una cartilla de ${recordType}`);
      }
    }

    if (pet.species === 'Gato') {
      if (recordType !== 'adulto' && recordType !== 'gatito') {
        throw new BadRequestException('El tipo de registro debe ser adulto o gatito');
      }
      const ageInMonths = calculateAgeInMonths(pet.birthDate);
      if (recordType === 'gatito' && ageInMonths >= 12) {
        throw new BadRequestException('Solo se pueden registrar gatitos menores de 12 meses');
      }
      if (recordType === 'adulto' && ageInMonths < 12) {
        throw new BadRequestException('Solo se pueden registrar adultos mayores o iguales a 12 meses');
      }
      const existingRecord = await this.prisma.vaccinationRecord.findFirst({
        where: {
          petId,
          recordType,
        },
      });
      if (existingRecord) {
        throw new BadRequestException(`La mascota con ID ${petId} ya tiene una cartilla de ${recordType}`);
      }
    }

    const updatedRecord = await this.prisma.vaccinationRecord.update({
      where: { id },
      data: updateVaccinationDto,
    });

    return updatedRecord;
  }

  @ApiOperation({ summary: 'Eliminar un registro de vacunación por ID' })
  @ApiResponse({ status: 200, description: 'Registro de vacunación eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Registro de vacunación no encontrado.' })
  async deletePetByUserOrAdmin(id: number, user: User): Promise<{ message: string }> {
    const vaccinationRecord = await this.prisma.vaccinationRecord.findUnique({
      where: { id },
      include: {
        pet: true,
      },
    });
    if (!vaccinationRecord) {
      throw new NotFoundException(`Registro de vacunación con ID ${id} no encontrado`);
    }

    if (user.role !== 'ADMIN' && vaccinationRecord.pet.userid !== user.id) {
      throw new BadRequestException('No tienes permiso para eliminar este registro');
    }

    await this.prisma.vaccinationRecord.delete({ where: { id } });

    return { message: 'Registro de vacunación eliminado exitosamente.' };
  }
}
