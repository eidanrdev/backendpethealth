import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client'; // Asegúrate de que User esté importado correctamente

@ApiTags('Actividades') 
@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  @ApiOperation({ summary: 'Crear una nueva actividad' })
  @ApiResponse({ status: 201, description: 'Actividad creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada.' })
  async createActivity(createActivityDto: CreateActivityDto, user: User) {
  const { activityType, description, date, petId } = createActivityDto;
  const parsedDate = new Date(date);
  const now = new Date();

  // Validar si la fecha está en el pasado
  if (parsedDate < now) {
    throw new BadRequestException('La fecha de la actividad no puede estar en el pasado');
  }

  const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
  if (!pet) {
    throw new NotFoundException(`Mascota con ID ${petId} no encontrada`);
  }

  // Verifica si el usuario tiene permiso para crear la actividad
  if (user.role !== 'ADMIN' && pet.userid !== user.id) {
    throw new BadRequestException('No tienes permiso para crear una actividad para esta mascota');
  }

  const activity = await this.prisma.activity.create({
    data: {
      activityType,
      description,
      date: parsedDate,
      petId,
    },
  });
  return {
    message: 'Actividad creada exitosamente',
    activity,
  };
}


  @ApiOperation({ summary: 'Obtener todas las actividades' })
  @ApiResponse({ status: 200, description: 'Actividades encontradas.' })
  async findAllActivities(user: User) {
    if (user.role === 'ADMIN') {
      const activities = await this.prisma.activity.findMany({
        include: { pet: true },
      });
      return {
        message: 'Actividades encontradas',
        activities,
      };
    }

    // Si el usuario es USER, obtiene solo las actividades de sus mascotas
    const pets = await this.prisma.pet.findMany({ where: { userid: user.id } });
    const petIds = pets.map(pet => pet.id);

    const activities = await this.prisma.activity.findMany({
      where: { petId: { in: petIds } },
      include: { pet: true },
    });

    return {
      message: 'Actividades encontradas',
      activities,
    };
  }

  @ApiOperation({ summary: 'Obtener una actividad por ID' })
  @ApiResponse({ status: 200, description: 'Actividad encontrada.' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada.' })
  async findActivityById(id: number, user: User) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: { pet: true },
    });
    if (!activity) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }

    // Verifica si el usuario tiene permiso para ver la actividad
    if (user.role !== 'ADMIN' && activity.pet.userid !== user.id) {
      throw new BadRequestException('No tienes permiso para ver esta actividad');
    }

    return {
      message: 'Actividad encontrada',
      activity,
    };
  }

  @ApiOperation({ summary: 'Actualizar una actividad existente' })
  @ApiResponse({ status: 200, description: 'Actividad actualizada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada.' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada.' })
  async updateActivity(id: number, updateActivityDto: UpdateActivityDto, user: User) {
  const { activityType, description, date, petId } = updateActivityDto;

  const activity = await this.prisma.activity.findUnique({ where: { id } });
  if (!activity) {
    throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
  }

  const pet = await this.prisma.pet.findUnique({ where: { id: activity.petId } });

  // Verifica si el usuario tiene permiso para actualizar la actividad
  if (user.role !== 'ADMIN' && pet.userid !== user.id) {
    throw new BadRequestException('No tienes permiso para actualizar esta actividad');
  }

  const updateData: any = {};

  if (activityType !== undefined) updateData.activityType = activityType;
  if (description !== undefined) updateData.description = description;
  if (date !== undefined) {
    const parsedDate = new Date(date);
    const now = new Date();

    // Validar si la nueva fecha está en el pasado
    if (parsedDate < now) {
      throw new BadRequestException('La fecha de la actividad no puede estar en el pasado');
    }
    updateData.date = parsedDate;
  }

  if (petId !== undefined) {
    const petToUpdate = await this.prisma.pet.findUnique({ where: { id: petId } });
    if (!petToUpdate) {
      throw new NotFoundException(`Mascota con ID ${petId} no encontrada`);
    }
    updateData.petId = petId;
  }

  try {
    const updatedActivity = await this.prisma.activity.update({
      where: { id },
      data: updateData,
    });
    return {
      message: 'Actividad actualizada exitosamente',
      activity: updatedActivity,
    };
  } catch (error) {
    throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
  }
}

  @ApiOperation({ summary: 'Eliminar una actividad por ID' })
  @ApiResponse({ status: 200, description: 'Actividad eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada.' })
  async deleteActivity(id: number, user: User) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }

    const pet = await this.prisma.pet.findUnique({ where: { id: activity.petId } });
    
    // Verifica si el usuario tiene permiso para eliminar la actividad
    if (user.role !== 'ADMIN' && pet.userid !== user.id) {
      throw new BadRequestException('No tienes permiso para eliminar esta actividad');
    }

    await this.prisma.activity.delete({ where: { id } });
    return {
      message: 'Actividad eliminada exitosamente',
      activity,
    };
  }
}
