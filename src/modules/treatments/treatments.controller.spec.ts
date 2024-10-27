import { Test, TestingModule } from '@nestjs/testing';
import { TreatmentsController } from './treatments.controller';
import { TreatmentsService } from './treatments.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';

describe('TreatmentsController', () => {
  let controller: TreatmentsController;
  let service: TreatmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreatmentsController],
      providers: [TreatmentsService, PrismaService],
    }).compile();

    controller = module.get<TreatmentsController>(TreatmentsController);
    service = module.get<TreatmentsService>(TreatmentsService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('Operaciones CRUD', () => {
  it('debería crear un tratamiento', async () => {
    const createTreatmentDto: CreateTreatmentDto = {
      name: 'Tratamiento A',
      description: 'Descripción A',
      startDate: new Date(),
      endDate: new Date(),
      petId: 1,
    };
    const resultado = {
      message: 'Tratamiento creado exitosamente',
      treatment: { ...createTreatmentDto, id: 1 },
    };

    jest.spyOn(service, 'createTreatment').mockResolvedValue(resultado);

    expect(await controller.createTreatment(createTreatmentDto)).toBe(resultado);
  });

  it('debería obtener todos los tratamientos', async () => {
    const resultado = {
      message: 'Tratamientos encontrados',
      treatments: [{ 
        pet:{
          id:1,
          name: 'Buddy',
          species: 'Perro',
          breed: 'Golden Retriever',
          birthDate: new Date('2020-01-01'),
          color: 'Golden',
          userid: 1,
          },
        id: 1, name: 'Tratamiento A', description: 'Descripción A', petId: 1,startDate: new Date(),
        endDate: new Date(),
      } 
      ],
    };

    jest.spyOn(service, 'findAll').mockResolvedValue(resultado);

    expect(await controller.getAllTreatments()).toBe(resultado);
  });

  it('debería obtener un tratamiento por ID', async () => {
    const resultado = {
      message: 'Tratamiento encontrado',
      treatment: { 
        pet:{
          id:1,
          name: 'Buddy',
          species: 'Perro',
          breed: 'Golden Retriever',
          birthDate: new Date('2020-01-01'),
          color: 'Golden',
          userid: 1,
          },
        id: 1, name: 'Tratamiento A', description: 'Descripción A', petId: 1,startDate: new Date(),
        endDate: new Date(),
      } 
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(resultado);

    expect(await controller.getTreatmentById(1)).toBe(resultado);
  });

  it('debería actualizar un tratamiento por ID', async () => {
    const updateTreatmentDto: UpdateTreatmentDto = {
      name: 'Tratamiento B',
      description: 'Descripción B',
      startDate: new Date(),
      endDate: new Date(),
      petId: 1,
    };
    const resultado = {
      message: 'Tratamiento actualizado exitosamente',
      treatment: { 
        pet:{
          id:1,
          name: 'Buddy',
          species: 'Perro',
          breed: 'Golden Retriever',
          birthDate: new Date('2020-01-01'),
          color: 'Golden',
          userid: 1,
          },
        id: 1, name: 'Tratamiento A', description: 'Descripción A', petId: 1,startDate: new Date(),
        endDate: new Date(),
      } 
    };

    jest.spyOn(service, 'updateTreatment').mockResolvedValue(resultado);

    expect(await controller.updateTreatment(1, updateTreatmentDto)).toBe(resultado);
  });

  it('debería eliminar un tratamiento por ID', async () => {
    const resultado = {
      message: 'Tratamiento eliminado exitosamente',
      treatment: { 
        pet:{
          id:1,
          name: 'Buddy',
          species: 'Perro',
          breed: 'Golden Retriever',
          birthDate: new Date('2020-01-01'),
          color: 'Golden',
          userid: 1,
          },
        id: 1, name: 'Tratamiento A', description: 'Descripción A', petId: 1,startDate: new Date(),
        endDate: new Date(),
      } 
    };

    jest.spyOn(service, 'deleteTreatment').mockResolvedValue(resultado);

    expect(await controller.deleteTreatment(1)).toBe(resultado);
  });
})
});
