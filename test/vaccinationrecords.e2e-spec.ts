import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('VaccinationRecords E2E', () => {
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
    await prisma.vaccinationRecord.deleteMany();
    await prisma.pet.deleteMany({
      where: {
        name: {
          in: ['Buddy', 'Buddy Actualizado'],
        },
      },
    });
  });
  
  it('debería crear un registro de vacunación', async () => {
    const createVaccinationRecordDto = {
      recordType: 'adulto',
      petId: 72,
    };
  
    const response = await request(app.getHttpServer())
      .post('/vaccination-records')
      .send(createVaccinationRecordDto)
      .set('Authorization', `Bearer ${token}`)
  
    expect(response.body.message).toBe('Registro de vacunación creado exitosamente');
    expect(response.body.vaccinationRecord.recordType).toBe(createVaccinationRecordDto.recordType);
  });
  
  it('debería obtener todos los registros de vacunación', async () => {
    const createVaccinationRecordDto = {
        recordType: 'adulto',
        petId: 72,
      };
    
    const responsenew = await request(app.getHttpServer())
      .post('/vaccination-records')
      .send(createVaccinationRecordDto)
      .set('Authorization', `Bearer ${token}`)

    const response = await request(app.getHttpServer())
      .get('/vaccination-records')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  
    expect(response.body.length).toBeGreaterThan(0);
  });
  
  it('debería obtener un registro de vacunación por ID', async () => {
    const createPetDto = {
      name: 'Buddy',
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
  
    const response = await request(app.getHttpServer())
      .get(`/vaccination-records/${vaccinationRecordId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  
    expect(response.body.recordType).toBe(createVaccinationRecordDto.recordType);
  }, 10000);
  
  it('debería actualizar un registro de vacunación por ID', async () => {
    const createPetDto = {
      name: 'Buddy',
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
  
    const updateVaccinationRecordDto = {
      recordType: 'adulto',
      petId: petId,
    };
  
    const response = await request(app.getHttpServer())
      .put(`/vaccination-records/${vaccinationRecordId}`)
      .send(updateVaccinationRecordDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  
    expect(response.body.recordType).toBe(updateVaccinationRecordDto.recordType);
  });
  
  it('debería eliminar un registro de vacunación por ID', async () => {
    const createPetDto = {
      name: 'Buddy',
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
  
    await request(app.getHttpServer())
      .delete(`/vaccination-records/${vaccinationRecordId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });
})