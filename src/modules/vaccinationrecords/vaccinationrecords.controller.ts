import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { VaccinationrecordService } from './vaccinationrecords.service';
import { CreateVaccinationrecordDto } from './dto/create-vaccinationrecord.dto';
import { UpdateVaccinationrecordDto } from './dto/update-vaccinationrecord.dto';
import { JwtAuthGuard } from '../../guards/auth/jwt-auth.guard';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { GetUser } from '../../decorators/get-user.decorator'; 
import { User } from '@prisma/client'; 

@ApiTags('vaccination-records')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('vaccination-records')
export class VaccinationrecordController {
  constructor(private readonly vaccinationRecordService: VaccinationrecordService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo registro de vacunación' })
  @ApiResponse({
    status: 201,
    description: 'Registro de vacunación creado exitosamente.',
    type: CreateVaccinationrecordDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud, los datos enviados son inválidos.',
  })
  async create(@Body() createVaccinationDto: CreateVaccinationrecordDto, @GetUser() user: User) {
    return this.vaccinationRecordService.create(createVaccinationDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros de vacunación del usuario o todos si es ADMIN' })
  @ApiResponse({ status: 200, description: 'Lista de registros de vacunación.' })
  async getAllVaccinationRecords(@GetUser() user: User) {
    return this.vaccinationRecordService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro de vacunación por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del registro de vacunación' })
  @ApiResponse({ status: 200, description: 'Registro de vacunación encontrado.' })
  @ApiResponse({ status: 404, description: 'Registro de vacunación no encontrado.' })
  async getVaccinationRecordById(@Param('id') id: number, @GetUser() user: User) {
    return this.vaccinationRecordService.findOneByUserOrAdmin(id, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un registro de vacunación por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del registro de vacunación' })
  @ApiResponse({ status: 200, description: 'Registro de vacunación actualizado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  @ApiResponse({ status: 404, description: 'Registro de vacunación no encontrado.' })
  async updateVaccinationRecord(@Param('id') id: number, @Body() updateVaccinationDto: UpdateVaccinationrecordDto, @GetUser() user: User) {
    return this.vaccinationRecordService.updatePetByUserOrAdmin(id, updateVaccinationDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un registro de vacunación por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del registro de vacunación' })
  @ApiResponse({ status: 200, description: 'Registro de vacunación eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Registro de vacunación no encontrado.' })
  async deleteVaccinationRecord(@Param('id') id: number, @GetUser() user: User) {
    return this.vaccinationRecordService.deletePetByUserOrAdmin(id, user);
  }
}
