import { Test, TestingModule } from '@nestjs/testing';
import { VaccinationrecordController } from './vaccinationrecords.controller';
import { VaccinationrecordService } from './vaccinationrecords.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVaccinationrecordDto } from './dto/create-vaccinationrecord.dto';
import { UpdateVaccinationrecordDto } from './dto/update-vaccinationrecord.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

describe('VaccinationrecordController', () => {
  let controller: VaccinationrecordController;
  let service: VaccinationrecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaccinationrecordController],
      providers: [VaccinationrecordService, PrismaService],
    }).compile();

    controller = module.get<VaccinationrecordController>(VaccinationrecordController);
    service = module.get<VaccinationrecordService>(VaccinationrecordService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Operaciones de CRUD', () => {
  it('crear un vaccination record', async () => {
    const createDto: CreateVaccinationrecordDto = {
      recordType: 'gatito',
      petId: 1,
    };

    const result = {
      message: 'Registro de vacunación creado exitosamente',
      vaccinationRecord: {
        id: 1,
        recordType: 'gatito',
        petId: 1,
      },
    };

    jest.spyOn(service, 'create').mockImplementation(async () => result);

    expect(await controller.create(createDto)).toEqual(result);
  });

  it('retornar todas las vaccination records', async () => {
    const result = [
      {
        id: 1,
        recordType: 'gatito',
        petId: 1,
      },
      {
        id: 2,
        recordType: 'adulto',
        petId: 2,
      },
    ];

    jest.spyOn(service, 'findAll').mockImplementation(async () => result);

    expect(await controller.findAll()).toEqual(result);
  });

  it('retornar vaccination record por ID', async () => {
    const result = {
      id: 1,
      recordType: 'gatito',
      petId: 1,
      pet: {
        id: 1,
        name: 'Buddy',
        species: 'Perro',
        breed: 'Golden Retriever',
        birthDate: new Date('2020-01-01'),
        color: 'Golden',
        userid: 1,
      },
      vaccinations: [
        {
          id: 1,
          name: 'Rabies',
          applicationDate: new Date(),
          weight: new Decimal(10.5),
          petId: 1,
          vaccinationRecordId: 1,
        },
      ],
    };

    jest.spyOn(service, 'findOne').mockImplementation(async () => result);

    expect(await controller.findOne(1)).toEqual(result);
  });

  it('actualizar vaccination record por ID', async () => {
    const updateDto: UpdateVaccinationrecordDto = {
      recordType: 'adulto',
      petId: 1,
    };

    const result = {
      id: 1,
      recordType: 'adulto',
      petId: 1,
    };

    jest.spyOn(service, 'update').mockImplementation(async () => result);

    expect(await controller.update(1, updateDto)).toEqual(result);
  });

  it('Eliminar vaccination record por ID', async () => {
    const result = {
      message: 'Registro de vacunación eliminado exitosamente',
      vaccinationrecord: {
        id: 1,
        recordType: 'perrito',
        petId: 2,
    }
    };

    jest.spyOn(service, 'delete').mockImplementation(async () => result);

    expect(await controller.delete(1)).toEqual(result);
  });
  })
});