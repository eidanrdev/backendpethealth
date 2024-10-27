import { Test, TestingModule } from '@nestjs/testing';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

describe('PetsController', () => {
  let controller: PetsController;
  let service: PetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetsController],
      providers: [PetsService, PrismaService],
    }).compile();

    controller = module.get<PetsController>(PetsController);
    service = module.get<PetsService>(PetsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Operaciones CRUD', () => {
    it('Crear nuevo pet', async () => {
      const createPetDto: CreatePetDto = {
        name: 'Buddy',
        species: 'Perro',
        breed: 'Golden Retriever',
        birthDate: new Date('2020-01-01'),
        color: 'Golden',
        userid: 1,
      };

      const result = {
        message: 'Mascota creada exitosamente',
        pet: {
          id: 1,
          ...createPetDto,
          vaccinations: [],
          treatments: [],
          activities: [],
          consultations: [],
          vaccinationRecord: [],
        },
      };

      jest.spyOn(service, 'createPet').mockImplementation(async () => result);

      expect(await controller.createPet(createPetDto)).toEqual(result);
    });

    it('Buscar todas las pets', async () => {
      const result = {
        message: 'Mascotas encontradas',
        pets: [
          {
            id: 1,
            name: 'Buddy',
            species: 'Perro',
            breed: 'Golden Retriever',
            owner: {
              id: 1,
              name: 'John Doe',
            },
          },
        ],
      };

      jest.spyOn(service, 'findAll').mockImplementation(async () => result);

      expect(await controller.getAllPets()).toEqual(result);
    });

    it('Buscar pet por ID', async () => {
      const result = {
        message: 'Mascota encontrada',
        pet: {
          id: 1,
          name: 'Buddy',
          species: 'Perro',
          breed: 'Golden Retriever',
          birthDate: new Date('2020-01-01'),
          color: 'Golden',
          userid: 1,
          user: {
            id: 1,
            name: 'John Doe',
          },
          vaccinations: [],
          treatments: [],
          activities: [],
          consultations: [],
          vaccinationRecord: [],
        },
      };

      jest.spyOn(service, 'findOne').mockImplementation(async () => result);

      expect(await controller.getPetById(1)).toEqual(result);
    });

    it('Actualizar pet con ID', async () => {
      const updatePetDto: UpdatePetDto = {
        name: 'Buddy Updated',
        species: 'Perro',
        breed: 'Golden Retriever',
        birthDate: new Date('2020-01-01'),
        color: 'Golden',
        userid: 1,
        
      };

      const result = {
        message: 'Mascota actualizada exitosamente',
        pet: {
          id: 1,
          name: 'Buddy Updated',
        species: 'Perro',
        breed: 'Golden Retriever',
        birthDate: new Date('2020-01-01'),
        color: 'Golden',
        userid: 1,
        },
      };

      jest.spyOn(service, 'updatePet').mockImplementation(async () => result);

      expect(await controller.updatePet(1, updatePetDto)).toEqual(result);
    });

    it('Eliminar pet con ID', async () => {
      
      const result = {
        message: 'Mascota eliminada exitosamente',
        pet:{
          id:1,
          name: 'Buddy Updated',
        species: 'Perro',
        breed: 'Golden Retriever',
        birthDate: new Date('2020-01-01'),
        color: 'Golden',
        userid: 1,
        } 
      };

      jest.spyOn(service, 'deletePet').mockImplementation(async () => result);

      expect(await controller.deletePet(1)).toEqual(result);
    });
  });
});
