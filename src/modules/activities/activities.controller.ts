import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { JwtAuthGuard } from '../../guards/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client'; // Asegúrate de que User esté importado correctamente

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Actividades')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva actividad' })
  @ApiBody({ type: CreateActivityDto })
  @ApiResponse({ status: 201, description: 'La actividad ha sido creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Entrada inválida.' })
  async createActivity(
    @Body() createActivityDto: CreateActivityDto,
    @Request() req: any // Captura la solicitud para obtener el usuario
  ) {
    const user: User = req.user; // Obtiene el usuario del request
    return this.activitiesService.createActivity(createActivityDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las actividades' })
  @ApiResponse({ status: 200, description: 'Lista de todas las actividades.' })
  async getAllActivities(@Request() req: any) {
    const user: User = req.user;
    return this.activitiesService.findAllActivities(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una actividad por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la actividad a recuperar' })
  @ApiResponse({ status: 200, description: 'La actividad ha sido recuperada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada.' })
  async getActivityById(@Param('id') id: number, @Request() req: any) {
    const user: User = req.user;
    return this.activitiesService.findActivityById(Number(id), user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una actividad por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la actividad a actualizar' })
  @ApiBody({ type: UpdateActivityDto })
  @ApiResponse({ status: 200, description: 'La actividad ha sido actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Actividad o mascota no encontrada.' })
  @ApiResponse({ status: 400, description: 'Entrada inválida.' })
  async updateActivity(
    @Param('id') id: number,
    @Body() updateActivityDto: UpdateActivityDto,
    @Request() req: any
  ) {
    const user: User = req.user;
    return this.activitiesService.updateActivity(Number(id), updateActivityDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una actividad por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la actividad a eliminar' })
  @ApiResponse({ status: 200, description: 'La actividad ha sido eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada.' })
  async deleteActivity(@Param('id') id: number, @Request() req: any) {
    const user: User = req.user;
    return this.activitiesService.deleteActivity(Number(id), user);
  }
}
