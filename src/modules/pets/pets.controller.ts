import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { JwtAuthGuard } from '../../guards/auth/jwt-auth.guard';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('pets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pets')
export class PetsController {
  constructor(private petsService: PetsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva mascota' })
  @ApiResponse({ status: 201, description: 'Mascota creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  async createPet(@Body() createPetDto: CreatePetDto, @GetUser() user: User) {
    return this.petsService.createPet({ ...createPetDto, userid: Number(user.id) });
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las mascotas del usuario o todas si es ADMIN' })
  @ApiResponse({ status: 200, description: 'Lista de mascotas.' })
  async getAllPets(@GetUser() user: User) {
    if (user.role === 'ADMIN') {
      return this.petsService.findAll();
    }
    return this.petsService.findByUserId(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una mascota por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la mascota' })
  @ApiResponse({ status: 200, description: 'Mascota encontrada.' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada.' })
  async getPetById(@Param('id') id: number, @GetUser() user: User) {
    return this.petsService.findOneByUserOrAdmin(id, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una mascota por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la mascota' })
  @ApiResponse({ status: 200, description: 'Mascota actualizada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada.' })
  async updatePet(@Param('id') id: number, @Body() updatePetDto: UpdatePetDto, @GetUser() user: User) {
    return this.petsService.updatePetByUserOrAdmin(id, updatePetDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una mascota por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la mascota' })
  @ApiResponse({ status: 200, description: 'Mascota eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada.' })
  async deletePet(@Param('id') id: number, @GetUser() user: User) {
    return this.petsService.deletePetByUserOrAdmin(id, user);
  }
}
