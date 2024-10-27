import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('Consultations E2E', () => {
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
    await prisma.consultation.deleteMany();
    await prisma.pet.deleteMany({
      where: {
        name: {
          in: ['Luna', 'Luna Actualizado'],
        },
      },
    });
  });

  it('debería crear una consulta', async () => {
    const createPetDto = {
      name: 'Luna',
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

    const createConsultationDto = {
      veterinarian: 'Dr. Gomez',
      description: 'Consulta de rutina',
      date: '2024-08-23',
      petId: petId,
    };

    const response = await request(app.getHttpServer())
      .post('/consultations')
      .send(createConsultationDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(response.body.consultation.veterinarian).toBe(createConsultationDto.veterinarian);
    expect(response.body.consultation.petId).toBe(createConsultationDto.petId);
  }, 10000);

  it('debería obtener todas las consultas', async () => {
    const createPetDto = {
      name: 'Luna',
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

    const createConsultationDto = {
      veterinarian: 'Dr. Gomez',
      description: 'Consulta de rutina',
      date: '2024-08-23',
      petId: petId,
    };

    await request(app.getHttpServer())
      .post('/consultations')
      .send(createConsultationDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/consultations')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.consultations.length).toBeGreaterThan(0);
  });

  it('debería obtener una consulta por ID', async () => {
    const createPetDto = {
      name: 'Luna',
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

    const createConsultationDto = {
      veterinarian: 'Dr. Gomez',
      description: 'Consulta de rutina',
      date: '2024-08-23',
      petId: petId,
    };

    const consultationResponse = await request(app.getHttpServer())
      .post('/consultations')
      .send(createConsultationDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const consultationId = consultationResponse.body.consultation.id;

    const response = await request(app.getHttpServer())
      .get(`/consultations/${consultationId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.consultation.veterinarian).toBe(createConsultationDto.veterinarian);
  });

  it('debería actualizar una consulta por ID', async () => {
    const createPetDto = {
      name: 'Luna',
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

    const createConsultationDto = {
      veterinarian: 'Dr. Gomez',
      description: 'Consulta de rutina',
      date: '2024-08-23',
      petId: petId,
    };

    const consultationResponse = await request(app.getHttpServer())
      .post('/consultations')
      .send(createConsultationDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const consultationId = consultationResponse.body.consultation.id;

    const updateConsultationDto = {
      veterinarian: 'Dr. Perez',
      description: 'Consulta actualizada',
      date: '2024-08-24',
      petId: petId,
    };

    const response = await request(app.getHttpServer())
      .put(`/consultations/${consultationId}`)
      .send(updateConsultationDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.consultation.veterinarian).toBe(updateConsultationDto.veterinarian);
  });

  it('debería eliminar una consulta por ID', async () => {
    const createPetDto = {
      name: 'Luna',
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

    const createConsultationDto = {
      veterinarian: 'Dr. Gomez',
      description: 'Consulta de rutina',
      date: '2024-08-23',
      petId: petId,
    };

    const consultationResponse = await request(app.getHttpServer())
      .post('/consultations')
      .send(createConsultationDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const consultationId = consultationResponse.body.consultation.id;

    await request(app.getHttpServer())
      .delete(`/consultations/${consultationId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });
});
