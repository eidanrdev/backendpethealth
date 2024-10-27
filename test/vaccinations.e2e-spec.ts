import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('Vaccinations E2E', () => {
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
    await prisma.vaccination.deleteMany();
    await prisma.pet.deleteMany({ where: { name: 'Max' } });
  });

  const getCurrentDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  it('debería crear una vacunación', async () => {
    const createPetDto = {
      name: 'Max',
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
  
    const createVaccinationRecordDto = {
      recordType: 'cachorro',
      petId: petId,
    };
  
    const vaccinationRecordResponse = await request(app.getHttpServer())
      .post('/vaccination-records')
      .send(createVaccinationRecordDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
  
    const vaccinationRecordId = vaccinationRecordResponse.body.vaccinationRecord.id;

    const createVaccinationDto = {
      name: 'Rabia',
      applicationDate: getCurrentDate(),
      weight: 12.1,
      vaccinationRecordId: vaccinationRecordId,
      petId: petId,
    };

    const response = await request(app.getHttpServer())
      .post('/vaccinations')
      .send(createVaccinationDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(response.body.message).toBe('Vacuna creada exitosamente');
    expect(response.body.vaccination.name).toBe(createVaccinationDto.name);
  }, 7000);

  it('debería obtener todas las vacunaciones', async () => {
    const createPetDto = {
      name: 'Max',
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
  
    const createVaccinationRecordDto = {
      recordType: 'cachorro',
      petId: petId,
    };
  
    const vaccinationRecordResponse = await request(app.getHttpServer())
      .post('/vaccination-records')
      .send(createVaccinationRecordDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
  
    const vaccinationRecordId = vaccinationRecordResponse.body.vaccinationRecord.id;

    const createVaccinationDto = {
      name: 'Rabia',
      applicationDate: getCurrentDate(),
      weight: 12.1,
      vaccinationRecordId: vaccinationRecordId,
      petId: petId,
    };

    await request(app.getHttpServer())
      .post('/vaccinations')
      .send(createVaccinationDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const getAllResponse = await request(app.getHttpServer())
      .get('/vaccinations')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getAllResponse.body.vaccinations).toHaveLength(1);
  }, 7000);

  it('debería obtener una vacunación por ID', async () => {
    const createPetDto = {
      name: 'Max',
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

    const createVaccinationRecordDto = {
      recordType: 'cachorro',
      petId: petId,
    };

    const vaccinationRecordResponse = await request(app.getHttpServer())
      .post('/vaccination-records')
      .send(createVaccinationRecordDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const vaccinationRecordId = vaccinationRecordResponse.body.vaccinationRecord.id;

    const createVaccinationDto = {
      name: 'Rabia',
      applicationDate: getCurrentDate(),
      weight: 12.1,
      vaccinationRecordId: vaccinationRecordId,
      petId: petId,
    };

    const response = await request(app.getHttpServer())
      .post('/vaccinations')
      .send(createVaccinationDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const vaccinationId = response.body.vaccination.id;

    const getResponse = await request(app.getHttpServer())
      .get(`/vaccinations/${vaccinationId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getResponse.body.vaccination.id).toBe(vaccinationId);
    expect(getResponse.body.vaccination.name).toBe(createVaccinationDto.name);
  }, 7000);

  it('debería actualizar una vacunación por ID', async () => {
    const createPetDto = {
      name: 'Max',
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
  
    const createVaccinationRecordDto = {
      recordType: 'cachorro',
      petId: petId,
    };
  
    const vaccinationRecordResponse = await request(app.getHttpServer())
      .post('/vaccination-records')
      .send(createVaccinationRecordDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
  
    const vaccinationRecordId = vaccinationRecordResponse.body.vaccinationRecord.id;

    const createVaccinationDto = {
      name: 'Rabia',
      applicationDate: getCurrentDate(),
      weight: 12.1,
      vaccinationRecordId: vaccinationRecordId,
      petId: petId,
    };

    const response = await request(app.getHttpServer())
      .post('/vaccinations')
      .send(createVaccinationDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const vaccinationId = response.body.vaccination.id;

    const updateVaccinationDto = {
      name: 'Rabia Actualizada',
      weight: 15.8,
    };

    const updateResponse = await request(app.getHttpServer())
      .put(`/vaccinations/${vaccinationId}`)
      .send(updateVaccinationDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(updateResponse.body.message).toBe('Vacuna actualizada exitosamente');
    expect(updateResponse.body.vaccination.name).toBe(updateVaccinationDto.name);
  }, 7000);

  it('debería eliminar una vacunación', async () => {
    const createPetDto = {
      name: 'Max',
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

    const createVaccinationRecordDto = {
      recordType: 'cachorro',
      petId: petId,
    };

    const vaccinationRecordResponse = await request(app.getHttpServer())
      .post('/vaccination-records')
      .send(createVaccinationRecordDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const vaccinationRecordId = vaccinationRecordResponse.body.vaccinationRecord.id;

    const createVaccinationDto = {
      name: 'Rabia',
      applicationDate: getCurrentDate(),
      weight: 12.1,
      vaccinationRecordId: vaccinationRecordId,
      petId: petId,
    };

    const response = await request(app.getHttpServer())
      .post('/vaccinations')
      .send(createVaccinationDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const vaccinationId = response.body.vaccination.id;

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/vaccinations/${vaccinationId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(deleteResponse.body.message).toBe('Vacuna eliminada exitosamente');
  }, 7000);

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });
});
