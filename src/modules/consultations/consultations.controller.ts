import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { JwtAuthGuard } from '../../guards/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client'; // Asegúrate de que User esté importado correctamente

@ApiTags('Consultations') 
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva consulta' })
  @ApiResponse({ status: 201, description: 'Consulta creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  async create(@Body() createConsultationDto: CreateConsultationDto, @Req() request: any) {
    const user: User = request.user; // Obtener el usuario del request
    return this.consultationsService.createConsultation(createConsultationDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las consultas' })
  @ApiResponse({ status: 200, description: 'Consultas encontradas.' })
  async findAll(@Req() request: any) {
    const user: User = request.user;
    return this.consultationsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una consulta por ID' })
  @ApiResponse({ status: 200, description: 'Consulta encontrada.' })
  @ApiResponse({ status: 404, description: 'Consulta no encontrada.' })
  async findOne(@Param('id') id: number, @Req() request: any) {
    const user: User = request.user;
    const consultation = await this.consultationsService.findOne(Number(id), user);
    if (!consultation) {
      throw new NotFoundException(`Consulta con ID ${id} no encontrada`);
    }
    return consultation;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una consulta existente' })
  @ApiResponse({ status: 200, description: 'Consulta actualizada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  @ApiResponse({ status: 404, description: 'Consulta no encontrada.' })
  async update(@Param('id') id: number, @Body() updateConsultationDto: UpdateConsultationDto, @Req() request: any) {
    const user: User = request.user;
    const consultation = await this.consultationsService.updateConsultation(Number(id), updateConsultationDto, user);
    if (!consultation) {
      throw new NotFoundException(`Consulta con ID ${id} no encontrada`);
    }
    return consultation;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una consulta por ID' })
  @ApiResponse({ status: 200, description: 'Consulta eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Consulta no encontrada.' })
  async remove(@Param('id') id: number, @Req() request: any) {
    const user: User = request.user;
    const consultation = await this.consultationsService.deleteConsultation(Number(id), user);
    if (!consultation) {
      throw new NotFoundException(`Consulta con ID ${id} no encontrada`);
    }
    return consultation;
  }
}
