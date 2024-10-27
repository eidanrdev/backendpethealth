import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { User } from '@prisma/client';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async createPet(createPetDto: CreatePetDto) {
    const { name, species, breed, birthDate, color, userid } = createPetDto;
  
    const parsedBirthDate = new Date(birthDate);
    const today = new Date();
    if (parsedBirthDate > today) {
      throw new BadRequestException('La fecha de nacimiento no puede estar en el futuro');
    }
  
    const pet = await this.prisma.pet.create({
      data: {
        name,
        species,
        breed,
        birthDate: parsedBirthDate,
        color,
        userid, 
      },
    });
  
    return {
      message: 'Mascota creada exitosamente',
      pet,
    };
  }
  

  async findAll() {
    return this.prisma.pet.findMany({
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async findByUserId(userid: number) {
    return this.prisma.pet.findMany({
      where: { userid },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async findOneByUserOrAdmin(id: number, user: User) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } } },
    });
    if (!pet) {
      throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    }
    if (user.role !== 'ADMIN' && pet.userid !== user.id) {
      throw new ForbiddenException('No tienes permiso para ver esta mascota');
    }
    return { message: 'Mascota encontrada', pet };
  }

  async updatePetByUserOrAdmin(id: number, data: UpdatePetDto, user: User) {
    const pet = await this.findOneByUserOrAdmin(id, user);

    const { birthDate, userid } = data;
    if (userid && userid !== pet.pet.userid) {
      const owner = await this.prisma.user.findUnique({ where: { id: userid } });
      if (!owner) {
        throw new NotFoundException(`Usuario con ID ${userid} no encontrado`);
      }
    }

    if (birthDate && new Date(birthDate) > new Date()) {
      throw new BadRequestException('La fecha de nacimiento no puede estar en el futuro');
    }

    const updatedPet = await this.prisma.pet.update({ where: { id }, data });
    return { message: 'Mascota actualizada exitosamente', pet: updatedPet };
  }

  async deletePetByUserOrAdmin(id: number, user: User) {
    const pet = await this.findOneByUserOrAdmin(id, user);
    await this.prisma.pet.delete({ where: { id } });
    return { message: 'Mascota eliminada exitosamente', pet };
  }
}
