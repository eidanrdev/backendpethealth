import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '@prisma/client'; // Asegúrate de que User esté importado correctamente

@Injectable()
export class TreatmentsService {
  constructor(private prisma: PrismaService) {}

  @ApiOperation({ summary: 'Crear un nuevo treatment' })
  @ApiResponse({ status: 201, description: 'Treatment creado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada.' })
  async createTreatment(createTreatmentDto: CreateTreatmentDto, user: User) {
    const { name, description, startDate, endDate, petId } = createTreatmentDto;
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    // Verifica si la mascota existe
    const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) {
      throw new NotFoundException(`Mascota con ID ${petId} no encontrada`);
    }

    // Verifica si el usuario tiene permiso para crear el tratamiento
    if (user.role !== 'ADMIN' && pet.userid !== user.id) { // Asegúrate de que pet.userId tenga el ID correcto del dueño
      throw new BadRequestException('No tienes permiso para crear un tratamiento para esta mascota');
    }

    // Crea el tratamiento
    const treatment = await this.prisma.treatment.create({
      data: {
        name,
        description,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        petId,
      },
    });
    return {
      message: 'Tratamiento creado exitosamente',
      treatment,
    };
  }

  @ApiOperation({ summary: 'Obtener un treatment por ID' })
  @ApiResponse({ status: 200, description: 'Treatment encontrado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Treatment no encontrado.' })
  async findOne(id: number, user: User) {
    const treatment = await this.prisma.treatment.findUnique({
      where: { id },
      include: { pet: true },
    });

    if (!treatment) {
      throw new NotFoundException(`Tratamiento con ID ${id} no encontrado`);
    }

    // Verifica si el usuario tiene permiso para ver el tratamiento
    if (user.role !== 'ADMIN' && treatment.pet.userid !== user.id) {
      throw new BadRequestException('No tienes permiso para ver este tratamiento');
    }

    return {
      message: 'Tratamiento encontrado',
      treatment,
    };
  }

  @ApiOperation({ summary: 'Obtener todos los treatments' })
  @ApiResponse({ status: 200, description: 'Treatments encontrados exitosamente.' })
  async findAll(user: User) {
    // Si el usuario es ADMIN, obtiene todos los treatments
    if (user.role === 'ADMIN') {
      const treatments = await this.prisma.treatment.findMany({
        include: { pet: true },
      });
      return {
        message: 'Tratamientos encontrados',
        treatments,
      };
    }

    // Si el usuario es USER, obtiene solo los treatments de sus mascotas
    const pets = await this.prisma.pet.findMany({ where: { userid: user.id } });
    const petIds = pets.map(pet => pet.id);

    const treatments = await this.prisma.treatment.findMany({
      where: { petId: { in: petIds } },
      include: { pet: true },
    });

    return {
      message: 'Tratamientos encontrados',
      treatments,
    };
  }

  @ApiOperation({ summary: 'Actualizar un treatment por ID' })
  @ApiResponse({ status: 200, description: 'Treatment actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada o Treatment no encontrado.' })
  async updateTreatment(id: number, data: UpdateTreatmentDto, user: User) {
    const { name, description, startDate, endDate, petId } = data;

    const treatment = await this.prisma.treatment.findUnique({ where: { id } });
    if (!treatment) {
      throw new NotFoundException(`Tratamiento con ID ${id} no encontrado`);
    }

    const pet = await this.prisma.pet.findUnique({ where: { id: treatment.petId } });
    
    // Verifica si el usuario tiene permiso para actualizar el tratamiento
    if (user.role !== 'ADMIN' && pet.userid !== user.id) {
      throw new BadRequestException('No tienes permiso para actualizar este tratamiento');
    }

    // Verifica si la mascota existe si se proporciona petId
    if (petId) {
      const petToUpdate = await this.prisma.pet.findUnique({ where: { id: petId } });
      if (!petToUpdate) {
        throw new NotFoundException(`Mascota con ID ${petId} no encontrada`);
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (petId !== undefined) updateData.petId = petId;

    const updatedTreatment = await this.prisma.treatment.update({
      where: { id },
      data: updateData,
    });

    return {
      message: 'Tratamiento actualizado exitosamente',
      treatment: updatedTreatment,
    };
  }

  @ApiOperation({ summary: 'Eliminar un treatment por ID' })
  @ApiResponse({ status: 200, description: 'Treatment eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Treatment no encontrado.' })
  async deleteTreatment(id: number, user: User) {
    const treatment = await this.prisma.treatment.findUnique({ where: { id } });
    if (!treatment) {
      throw new NotFoundException(`Tratamiento con ID ${id} no encontrado`);
    }

    const pet = await this.prisma.pet.findUnique({ where: { id: treatment.petId } });
    
    // Verifica si el usuario tiene permiso para eliminar el tratamiento
    if (user.role !== 'ADMIN' && pet.userid !== user.id) {
      throw new BadRequestException('No tienes permiso para eliminar este tratamiento');
    }

    await this.prisma.treatment.delete({ where: { id } });
    return {
      message: 'Tratamiento eliminado exitosamente',
      treatment,
    };
  }
}
