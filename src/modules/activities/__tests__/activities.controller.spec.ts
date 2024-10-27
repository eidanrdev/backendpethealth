import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ActivitiesController } from '../activities.controller';
import { ActivitiesService } from '../activities.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';

describe('ActivitiesController', () => {
  let controller: ActivitiesController;
  let service: ActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [ActivitiesService, PrismaService],
    }).compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
    service = module.get<ActivitiesService>(ActivitiesService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('Operaciones CRUD', () => {
  it('debería crear una actividad', async () => {
    const createActivityDto: CreateActivityDto = {
      activityType: 'Ejercicio',
      description: 'Paseo diario',
      date: new Date(),
      petId: 1,
    };
    const resultado = {
      message: 'Actividad creada exitosamente',
      activity: { ...createActivityDto, id: 1 },
    };

    jest.spyOn(service, 'createActivity').mockResolvedValue(resultado);

    expect(await controller.createActivity(createActivityDto)).toBe(resultado);
  });

  it('debería obtener todas las actividades', async () => {
    const resultado = {
      message: 'Actividades encontradas',
      activities: [{pet: {
        id:1,
        name: 'Buddy',
        species: 'Perro',
        breed: 'Golden Retriever',
        birthDate: new Date('2020-01-01'),
        color: 'Golden',
        userid: 1,
      }, id: 1, activityType: 'Ejercicio', description: 'Paseo diario',date: new Date('2020-01-01'),  petId: 1 }],
    };

    jest.spyOn(service, 'findAllActivities').mockResolvedValue(resultado);

    expect(await controller.getAllActivities()).toBe(resultado);
  });

  it('debería obtener una actividad por ID', async () => {
    const resultado = {
      message: 'Actividad encontrada',
      activity: {pet: {
        id:1,
        name: 'Buddy',
        species: 'Perro',
        breed: 'Golden Retriever',
        birthDate: new Date('2020-01-01'),
        color: 'Golden',
        userid: 1,
      }, id: 1, activityType: 'Ejercicio', description: 'Paseo diario',date: new Date('2020-01-01'),  petId: 1 }
    };

    jest.spyOn(service, 'findActivityById').mockResolvedValue(resultado);

    expect(await controller.getActivityById(1)).toBe(resultado);
  });

  it('debería actualizar una actividad por ID', async () => {
    const updateActivityDto: UpdateActivityDto = {
      activityType: 'Ejercicio',
      description: 'Paseo prolongado',
      date: new Date(),
      petId: 1,
    };
    const resultado = {
      message: 'Actividad actualizada exitosamente',
      activity: { id: 1, activityType: 'Ejercicio', description: 'Paseo prolongado', date: new Date('2020-01-01'),petId: 1 },
    };

    jest.spyOn(service, 'updateActivity').mockResolvedValue(resultado);

    expect(await controller.updateActivity(1, updateActivityDto)).toBe(resultado);
  });

  it('debería eliminar una actividad por ID', async () => {
    const resultado = {
      message: 'Actividad eliminada exitosamente',
      activity: { id: 1, activityType: 'Ejercicio', description: 'Paseo diario', date: new Date('2020-01-01'),petId: 1 },
    };

    jest.spyOn(service, 'deleteActivity').mockResolvedValue(resultado);

    expect(await controller.deleteActivity(1)).toBe(resultado);
  });
})
});
