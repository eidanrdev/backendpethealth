import { Test, TestingModule } from '@nestjs/testing';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';

describe('ConsultationsController', () => {
  let controller: ConsultationsController;
  let service: ConsultationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultationsController],
      providers: [ConsultationsService, PrismaService],
    }).compile();

    controller = module.get<ConsultationsController>(ConsultationsController);
    service = module.get<ConsultationsService>(ConsultationsService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('Operaciones CRUD', () => {
  it('debería crear una consulta', async () => {
    const createConsultationDto: CreateConsultationDto = {
      veterinarian: 'Dr. Martínez',
      description: 'Consulta de rutina',
      date: new Date(),
      petId: 1,
    };
    const resultado = {
      message: 'Consulta creada exitosamente',
      consultation: { ...createConsultationDto, id: 1 },
    };

    jest.spyOn(service, 'createConsultation').mockResolvedValue(resultado);

    expect(await controller.create(createConsultationDto)).toBe(resultado);
  });

  it('debería obtener todas las consultas', async () => {
    const resultado = {
      message: 'Consultas encontradas',
      consultations: [{
        pet: {
          id:1,
          name: 'Buddy',
          species: 'Perro',
          breed: 'Golden Retriever',
          birthDate: new Date('2020-01-01'),
          color: 'Golden',
          userid: 1,
        },
      id: 1, veterinarian: 'Dr. Martínez', description: 'Consulta de rutina', petId: 1,
        date: new Date('2020-01-01')
    }]
  }

    jest.spyOn(service, 'findAll').mockResolvedValue(resultado);

    expect(await controller.findAll()).toBe(resultado);
  });

  it('debería obtener una consulta por ID', async () => {
    const resultado = {
      message: 'Consulta encontrada',
      consultation: {
        pet: {
          id:1,
          name: 'Buddy',
          species: 'Perro',
          breed: 'Golden Retriever',
          birthDate: new Date('2020-01-01'),
          color: 'Golden',
          userid: 1,
        },
      id: 1, veterinarian: 'Dr. Martínez', description: 'Consulta de rutina', petId: 1,
        date: new Date('2020-01-01')
    }
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(resultado);

    expect(await controller.findOne(1)).toBe(resultado);
  });

  it('debería actualizar una consulta por ID', async () => {
    const updateConsultationDto: UpdateConsultationDto = {
      veterinarian: 'Dr. Gómez',
      description: 'Consulta de seguimiento',
      date: new Date(),
      petId: 1,
    };
    const resultado = {
      message: 'Consulta actualizada exitosamente',
      consultation: {
        pet: {
          id:1,
          name: 'Buddy',
          species: 'Perro',
          breed: 'Golden Retriever',
          birthDate: new Date('2020-01-01'),
          color: 'Golden',
          userid: 1,
        },
      id: 1, veterinarian: 'Dr. Martínez', description: 'Consulta de rutina', petId: 1,
        date: new Date('2020-01-01')
    }
    };

    jest.spyOn(service, 'updateConsultation').mockResolvedValue(resultado);

    expect(await controller.update(1, updateConsultationDto)).toBe(resultado);
  });

  it('debería eliminar una consulta por ID', async () => {
    const resultado = {
      message: 'Consulta eliminada exitosamente',
      consultation: {
        pet: {
          id:1,
          name: 'Buddy',
          species: 'Perro',
          breed: 'Golden Retriever',
          birthDate: new Date('2020-01-01'),
          color: 'Golden',
          userid: 1,
        },
      id: 1, veterinarian: 'Dr. Martínez', description: 'Consulta de rutina', petId: 1,
        date: new Date('2020-01-01')
    }
    };

    jest.spyOn(service, 'deleteConsultation').mockResolvedValue(resultado);

    expect(await controller.remove(1)).toBe(resultado);
  });
  })
});
