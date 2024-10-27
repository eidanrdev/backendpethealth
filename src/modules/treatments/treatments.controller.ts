import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TreatmentsService } from './treatments.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { JwtAuthGuard } from '../../guards/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client'; // Importa el tipo User si es necesario

@ApiTags('treatments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('treatments')
export class TreatmentsController {
  constructor(private treatmentsService: TreatmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo treatment' })
  @ApiResponse({ status: 201, description: 'El treatment ha sido creado exitosamente.', type: CreateTreatmentDto })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  async createTreatment(@Body() createTreatmentDto: CreateTreatmentDto, @Request() req) {
    const user: User = req.user; // Obtener el usuario de la solicitud
    return this.treatmentsService.createTreatment(createTreatmentDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los treatments' })
  @ApiResponse({ status: 200, description: 'Lista de todos los treatments', type: [CreateTreatmentDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron treatments' })
  async getAllTreatments(@Request() req) {
    const user: User = req.user;
    return this.treatmentsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un treatment por ID' })
  @ApiResponse({ status: 200, description: 'El treatment ha sido encontrado exitosamente', type: CreateTreatmentDto })
  @ApiResponse({ status: 404, description: 'Treatment no encontrado' })
  async getTreatmentById(@Param('id') id: number, @Request() req) {
    const user: User = req.user;
    return this.treatmentsService.findOne(Number(id), user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un treatment existente' })
  @ApiResponse({ status: 200, description: 'El treatment ha sido actualizado exitosamente', type: UpdateTreatmentDto })
  @ApiResponse({ status: 404, description: 'Treatment no encontrado' })
  async updateTreatment(@Param('id') id: number, @Body() updateTreatmentDto: UpdateTreatmentDto, @Request() req) {
    const user: User = req.user; // Obtener el usuario de la solicitud
    return this.treatmentsService.updateTreatment(Number(id), updateTreatmentDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un treatment por ID' })
  @ApiResponse({ status: 200, description: 'El treatment ha sido eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Treatment no encontrado' })
  async deleteTreatment(@Param('id') id: number, @Request() req) {
    const user: User = req.user; // Obtener el usuario de la solicitud
    return this.treatmentsService.deleteTreatment(Number(id), user);
  }
}
