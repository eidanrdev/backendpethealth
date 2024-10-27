import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { VaccinationsService } from './vaccinations.service';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';
import { JwtAuthGuard } from '../../guards/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('vaccinations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('vaccinations')
export class VaccinationsController {
  constructor(private readonly vaccinationsService: VaccinationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva vacunación' })
  @ApiResponse({ status: 201, description: 'Vacunación creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  @ApiBody({ type: CreateVaccinationDto })
  async create(
    @Body() createVaccinationDto: CreateVaccinationDto,
    @GetUser() user: User,  // Obtener el usuario autenticado
  ) {
    return this.vaccinationsService.create(createVaccinationDto, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una vacunación por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la vacunación' })
  @ApiResponse({ status: 200, description: 'Vacunación encontrada.' })
  @ApiResponse({ status: 404, description: 'Vacunación no encontrada.' })
  async findOne(@Param('id') id: number, @GetUser() user: User) {
    return this.vaccinationsService.findOne(id, user);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las vacunaciones del usuario o todas si es ADMIN' })
  @ApiResponse({ status: 200, description: 'Lista de vacunaciones.' })
  async findAll(@GetUser() user: User) {
    return this.vaccinationsService.findAll(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una vacunación por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la vacunación' })
  @ApiBody({ type: UpdateVaccinationDto })
  @ApiResponse({ status: 200, description: 'Vacunación actualizada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  @ApiResponse({ status: 404, description: 'Vacunación no encontrada.' })
  async update(
    @Param('id') id: number,
    @Body() updateVaccinationDto: UpdateVaccinationDto,
    @GetUser() user: User,
  ) {
    return this.vaccinationsService.update(id, updateVaccinationDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una vacunación por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la vacunación' })
  @ApiResponse({ status: 200, description: 'Vacunación eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Vacunación no encontrada.' })
  async delete(@Param('id') id: number, @GetUser() user: User) {
    return this.vaccinationsService.delete(id, user);
  }
}
