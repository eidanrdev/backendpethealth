import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('Users E2E', () => {
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
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['juan@example.com', 'juan.updated@example.com'],
        },
      },
    });
  });

  it('debería crear un usuario', async () => {
    const createUserDto = { name: 'Juan Pérez', email: 'juan@example.com', password: 'password' };

    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send(createUserDto)
      .expect(201);

    expect(response.body.message).toBe('Usuario creado exitosamente');
    expect(response.body.user.email).toBe(createUserDto.email);
  });

  it('debería obtener todos los usuarios', async () => {
    const createUserDto = { name: 'Juan Pérez', email: 'juan@example.com', password: 'password' };
    await request(app.getHttpServer()).post('/users/register').send(createUserDto);

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toBe('Usuarios encontrados');
    expect(response.body.users.length).toBe(2);
  });

  it('debería obtener un usuario por ID', async () => {
    const createUserDto = { name: 'Juan Pérez', email: 'juan@example.com', password: 'password' };
    const { body } = await request(app.getHttpServer()).post('/users/register').send(createUserDto);

    const response = await request(app.getHttpServer())
      .get(`/users/${body.user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toBe('Usuario encontrado');
    expect(response.body.user.email).toBe(createUserDto.email);
  });

  it('debería actualizar un usuario por ID', async () => {
    const createUserDto = { name: 'Juan Pérez', email: 'juan@example.com', password: 'password' };
    const { body } = await request(app.getHttpServer()).post('/users/register').send(createUserDto);

    const updateUserDto = { name: 'Juan Actualizado', email: 'juan.updated@example.com' };
    const response = await request(app.getHttpServer())
      .put(`/users/${body.user.id}`)
      .send(updateUserDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toBe('Usuario actualizado exitosamente');
    expect(response.body.user.email).toBe(updateUserDto.email);
  });

  it('debería eliminar un usuario por ID', async () => {
    const createUserDto = { name: 'Juan Pérez', email: 'juan@example.com', password: 'password' };
    const { body } = await request(app.getHttpServer()).post('/users/register').send(createUserDto);

    const response = await request(app.getHttpServer())
      .delete(`/users/${body.user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toBe('Usuario eliminado exitosamente');
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });
});
