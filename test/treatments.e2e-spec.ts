import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('Treatments E2E', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let token: string;
  
    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
  
      app = moduleRef.createNestApplication();
      prisma = app.get(PrismaService);
  
      app.useGlobalPipes(new ValidationPipe());
      await app.init();
  
      const userTest = {
        email: process.env.TEST_USER,
        password: process.env.TEST_PWD,
      };
  
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(userTest)
        .expect(200);
  
      token = response.body.access_token;
  });

  beforeEach(async () => {
    await prisma.treatment.deleteMany({});
    await prisma.pet.deleteMany({ where: { name: 'Zucarita' } });
  });

  it('debería crear un tratamiento', async () => {
    const createPetDto = {
        name: 'Zucarita',
        species: 'Perro',
        breed: 'Labrador',
        birthDate: '2022-01-01',
        color: 'Marrón',
        userid: 29,
      };
  
      const petResponse = await request(app.getHttpServer())
        .post('/pets')
        .send(createPetDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
  
      const petId = petResponse.body.pet.id;

    const createTreatmentDto = {
      name: 'Desparasitación',
      description: 'Desparasitación anual',
      startDate: '2023-08-01',
      endDate: '2023-08-15',
      petId: petId,
    };

    const response = await request(app.getHttpServer())
      .post('/treatments')
      .set('Authorization', `Bearer ${token}`)
      .send(createTreatmentDto)
      .expect(201);

    expect(response.body.message).toBe('Tratamiento creado exitosamente');
    expect(response.body.treatment.name).toBe(createTreatmentDto.name);
  });

  it('debería obtener todos los tratamientos', async () => {
    const createPetDto = {
        name: 'Zucarita',
        species: 'Perro',
        breed: 'Labrador',
        birthDate: '2022-01-01',
        color: 'Marrón',
        userid: 29,
      };
  
      const petResponse = await request(app.getHttpServer())
        .post('/pets')
        .send(createPetDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
  
      const petId = petResponse.body.pet.id;

    await prisma.treatment.create({
      data: {
        name: 'Vacunación',
        description: 'Vacuna antirrábica',
        startDate: new Date('2023-07-01'),
        endDate: new Date('2023-07-01'),
        petId: petId,
      },
    });

    const response = await request(app.getHttpServer())
      .get('/treatments')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.treatments.length).toBeGreaterThan(0);
  });

  it('debería obtener un tratamiento por ID', async () => {
    const createPetDto = {
        name: 'Zucarita',
        species: 'Perro',
        breed: 'Labrador',
        birthDate: '2022-01-01',
        color: 'Marrón',
        userid: 29,
      };
  
      const petResponse = await request(app.getHttpServer())
        .post('/pets')
        .send(createPetDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
  
      const petId = petResponse.body.pet.id;

    const treatment = await prisma.treatment.create({
      data: {
        name: 'Vacunación',
        description: 'Vacuna antirrábica',
        startDate: new Date('2023-07-01'),
        endDate: new Date('2023-07-01'),
        petId: petId,
      },
    });

    const response = await request(app.getHttpServer())
      .get(`/treatments/${treatment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.treatment.name).toBe(treatment.name);
  });

  it('debería actualizar un tratamiento por ID', async () => {
    const createPetDto = {
        name: 'Zucarita',
        species: 'Perro',
        breed: 'Labrador',
        birthDate: '2022-01-01',
        color: 'Marrón',
        userid: 29,
      };
  
      const petResponse = await request(app.getHttpServer())
        .post('/pets')
        .send(createPetDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
  
      const petId = petResponse.body.pet.id;

    const treatment = await prisma.treatment.create({
      data: {
        name: 'Desparasitación',
        description: 'Desparasitación anual',
        startDate: new Date('2023-08-01'),
        endDate: new Date('2023-08-15'),
        petId: petId,
      },
    });

    const updateTreatmentDto = {
      name: 'Desparasitación actualizada',
      description: 'Desparasitación semestral',
      startDate: '2023-08-01',
      endDate: '2023-08-15',
      petId: petId,
    };

    const response = await request(app.getHttpServer())
      .put(`/treatments/${treatment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateTreatmentDto)
      .expect(200);

    expect(response.body.treatment.name).toBe(updateTreatmentDto.name);
  });

  it('debería eliminar un tratamiento por ID', async () => {
    const createPetDto = {
        name: 'Zucarita',
        species: 'Perro',
        breed: 'Labrador',
        birthDate: '2022-01-01',
        color: 'Marrón',
        userid: 29,
      };
  
      const petResponse = await request(app.getHttpServer())
        .post('/pets')
        .send(createPetDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
  
      const petId = petResponse.body.pet.id;

    const treatment = await prisma.treatment.create({
      data: {
        name: 'Vacunación',
        description: 'Vacuna antirrábica',
        startDate: new Date('2023-07-01'),
        endDate: new Date('2023-07-01'),
        petId: petId,
      },
    });

    const response = await request(app.getHttpServer())
      .delete(`/treatments/${treatment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toBe('Tratamiento eliminado exitosamente');
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });
});
