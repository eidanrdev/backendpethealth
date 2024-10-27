import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('Activities E2E', () => {
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
    await prisma.activity.deleteMany();
    await prisma.pet.deleteMany({
      where: {
        name: {
          in: ['Mayolo', 'Mayolo Actualizado'],
        },
      },
    });
  });

  it('debería crear una actividad', async () => {
    const createPetDto = {
      name: 'Mayolo',
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

    const createActivityDto = {
      activityType: 'Paseo',
      description: 'Paseo matutino por el parque',
      date: '2024-08-23',
      petId: petId,
    };

    const response = await request(app.getHttpServer())
      .post('/activities')
      .send(createActivityDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(response.body.activity.activityType).toBe(createActivityDto.activityType);
    expect(response.body.activity.petId).toBe(createActivityDto.petId);
  }, 10000);

  it('debería obtener todas las actividades', async () => {
    const createPetDto = {
      name: 'Mayolo',
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

    const createActivityDto = {
      activityType: 'Paseo',
      description: 'Paseo matutino por el parque',
      date: '2024-08-23',
      petId: petId,
    };

    await request(app.getHttpServer())
      .post('/activities')
      .send(createActivityDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/activities')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.activities.length).toBeGreaterThan(0);
  });

  it('debería obtener una actividad por ID', async () => {
    const createPetDto = {
      name: 'Mayolo',
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

    const createActivityDto = {
      activityType: 'Paseo',
      description: 'Paseo matutino por el parque',
      date: '2024-08-23',
      petId: petId,
    };

    const activityResponse = await request(app.getHttpServer())
      .post('/activities')
      .send(createActivityDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const activityId = activityResponse.body.activity.id;

    const response = await request(app.getHttpServer())
      .get(`/activities/${activityId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.body.activity.activityType).toBe(createActivityDto.activityType);
  });

  it('debería actualizar una actividad por ID', async () => {
    const createPetDto = {
      name: 'Mayolo',
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

    const createActivityDto = {
      activityType: 'Paseo',
      description: 'Paseo matutino por el parque',
      date: '2024-08-23',
      petId: petId,
    };

    const activityResponse = await request(app.getHttpServer())
      .post('/activities')
      .send(createActivityDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const activityId = activityResponse.body.activity.id;

    const updateActivityDto = {
      activityType: 'Visita al veterinario',
      description: 'Chequeo general',
      date: '2024-08-24',
      petId: petId,
    };

    const response = await request(app.getHttpServer())
      .put(`/activities/${activityId}`)
      .send(updateActivityDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.activity.activityType).toBe(updateActivityDto.activityType);
  });

  it('debería eliminar una actividad por ID', async () => {
    const createPetDto = {
      name: 'Mayolo',
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

    const createActivityDto = {
      activityType: 'Paseo',
      description: 'Paseo matutino por el parque',
      date: '2024-08-23',
      petId: petId,
    };

    const activityResponse = await request(app.getHttpServer())
      .post('/activities')
      .send(createActivityDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const activityId = activityResponse.body.activity.id;

    await request(app.getHttpServer())
      .delete(`/activities/${activityId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });
});
