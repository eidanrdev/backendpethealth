import { Test, TestingModule } from '@nestjs/testing';
import { VaccinationsController } from './vaccinations.controller';
import { VaccinationsService } from './vaccinations.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';
import { Decimal } from '@prisma/client/runtime/library';

describe('VaccinationsController', () => {
  let controller: VaccinationsController;
  let service: VaccinationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaccinationsController],
      providers: [VaccinationsService, PrismaService],
    }).compile();

    controller = module.get<VaccinationsController>(VaccinationsController);
    service = module.get<VaccinationsService>(VaccinationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Operaciones de CRUD', () => {
    it('Crear una vaccination', async () => {
      const createVaccinationDto: CreateVaccinationDto = {
        name: 'Rabies',
        applicationDate: new Date(),
        weight: new Decimal(10.5),
        petId: 1,
        vaccinationRecordId: 1,
      };

      const result = {
        message: 'Vacuna creada exitosamente',
        vaccination: {
          id: 1,
          ...createVaccinationDto,
        },
      };

      jest.spyOn(service, 'create').mockImplementation(async () => result);

      expect(await controller.create(createVaccinationDto)).toEqual(result);
    });

    it('Busca todas vaccinations', async () => {
      const result = {
        message: 'Vacunas encontradas',
        vaccinations:[ 
          {
            id: 1,
              name: 'Rabies',
              applicationDate: new Date(),
              weight: new Decimal(10.5),
              petId: 1,
              vaccinationRecordId: 1,
            pet: {
              id: 1,
              name: 'Buddy',
              species: 'Perro',
              breed: 'Labrador',
              birthDate: new Date('2020-01-01'),
              color: 'Brown',
              userid: 1,
            },
            vaccinationRecord: {
              id: 1,
              recordType: 'Cachorro',
              petId: 1,
            },
          },
            
          ]
      };

      jest.spyOn(service, 'findAll').mockImplementation(async () => result);

      expect(await controller.findAll()).toEqual(result);
    });

    it('Buscar vaccination por ID', async () => {
      const result = {
        message: 'Vacuna encontrada',
        vaccination: {
          id: 1,
          name: 'Rabies',
          applicationDate: new Date(),
          weight: new Decimal(10.5),
          petId: 1,
          vaccinationRecordId: 1,
          pet: {
            id: 1,
            name: 'Buddy',
            species: 'Perro',
            breed: 'Labrador',
            birthDate: new Date('2020-01-01'),
            color: 'Brown',
            userid: 1,
          },
          vaccinationRecord: {
            id: 1,
            recordType: 'Cachorro',
            petId: 1,
          },
        },
      };

      jest.spyOn(service, 'findOne').mockImplementation(async () => result);

      expect(await controller.findOne(1)).toEqual(result);
    });

    it('Actualizar vaccination por ID', async () => {
      const updateVaccinationDto: UpdateVaccinationDto = {
        name: 'Rabies Updated',
        applicationDate: new Date(),
        weight: new Decimal(11),
        petId: 1,
        vaccinationRecordId: 1,
      };

      const result = {
        message: 'Vacuna actualizada exitosamente',
        vaccination: {
          id: 1,
          name: 'Rabies Updated',
        applicationDate: new Date(),
        weight: new Decimal(11),
        petId: 1,
        vaccinationRecordId: 1,
        },
      };

      jest.spyOn(service, 'update').mockImplementation(async () => result);

      expect(await controller.update(1, updateVaccinationDto)).toEqual(result);
    });

    it('Borra vaccination por ID', async () => {
      const result = {
        message: 'Vacuna eliminada exitosamente',
        vaccination: {
          id: 1,
          name: 'Rabies',
          applicationDate: new Date(),
          weight: new Decimal(10.5),
          petId: 1,
          vaccinationRecordId: 1,
        },
      };

      jest.spyOn(service, 'delete').mockImplementation(async () => result);

      expect(await controller.delete(1)).toEqual(result);
    });
  });
});
