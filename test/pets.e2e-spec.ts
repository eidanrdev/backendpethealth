import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('Pets E2E', () => {
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
    await prisma.pet.deleteMany({
      where: {
        name: {
          in: ['Fido', 'Fido Actualizado'],
        },
      },
    });
  });

  it('debería crear una mascota', async () => {
    const createPetDto = { 
      name: 'Fido', 
      species: 'Perro', 
      breed: 'Labrador', 
      birthDate: '2020-01-01', 
      color: 'Marrón', 
      userid: 29
    };

    const response = await request(app.getHttpServer())
      .post('/pets')
      .send(createPetDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(response.body.message).toBe('Mascota creada exitosamente');
    expect(response.body.pet.name).toBe(createPetDto.name);
  });

  it('debería obtener todas las mascotas', async () => {
    const createPetDto = { 
      name: 'Fido', 
      species: 'Perro', 
      breed: 'Labrador', 
      birthDate: '2020-01-01', 
      color: 'Marrón', 
      userid: 29
    };
    await request(app.getHttpServer()).post('/pets').send(createPetDto).set('Authorization', `Bearer ${token}`);

    const response = await request(app.getHttpServer())
      .get('/pets')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toBe('Mascotas encontradas');
    expect(response.body.pets.length).toBeGreaterThan(0);
  });

  it('debería obtener una mascota por ID', async () => {
    const createPetDto = { 
      name: 'Fido', 
      species: 'Perro', 
      breed: 'Labrador', 
      birthDate: '2020-01-01', 
      color: 'Marrón', 
      userid: 29
    };
    const { body } = await request(app.getHttpServer())
      .post('/pets')
      .send(createPetDto)
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app.getHttpServer())
      .get(`/pets/${body.pet.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toBe('Mascota encontrada');
    expect(response.body.pet.name).toBe(createPetDto.name);
  });

  it('debería actualizar una mascota por ID', async () => {
    const createPetDto = { 
      name: 'Fido', 
      species: 'Perro', 
      breed: 'Labrador', 
      birthDate: '2020-01-01', 
      color: 'Marrón', 
      userid: 29
    };
    const { body } = await request(app.getHttpServer())
      .post('/pets')
      .send(createPetDto)
      .set('Authorization', `Bearer ${token}`);

    const updatePetDto = { 
      name: 'Fido Actualizado', 
      species: 'Perro', 
      breed: 'Golden Retriever', 
      birthDate: '2020-01-01', 
      color: 'Marrón', 
      userid: 29
    };
    const response = await request(app.getHttpServer())
      .put(`/pets/${body.pet.id}`)
      .send(updatePetDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toBe('Mascota actualizada exitosamente');
    expect(response.body.pet.name).toBe(updatePetDto.name);
  });

  it('debería eliminar una mascota por ID', async () => {
    const createPetDto = { 
      name: 'Fido', 
      species: 'Perro', 
      breed: 'Labrador', 
      birthDate: '2020-01-01', 
      color: 'Marrón', 
      userid: 29
    };
    const { body } = await request(app.getHttpServer())
      .post('/pets')
      .send(createPetDto)
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app.getHttpServer())
      .delete(`/pets/${body.pet.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toBe('Mascota eliminada exitosamente');
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });
});
