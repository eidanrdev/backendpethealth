import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";

describe('Acceder al perfil de usuario', () => {
  let app: INestApplication;

  // Preparar instancia de la aplicación: incluir el módulo
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  // Login test
  it(`/POST auth/login`, async () => {
    const userTest = {
      email: process.env.TEST_USER,
      password: process.env.TEST_PWD,
    };
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(userTest)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toBeDefined();
        expect(body.user.email).toEqual(userTest.email);
        expect(body.access_token).toBeDefined();
        process.env.TOKEN = body.access_token;
      });
  });

  // UnAuthorized user protected
  it(`/GET `, async () => {
    return request(app.getHttpServer())
      .get('/protected')
      .expect(401);
  });

  // Authorized user protected
  it(`/GET`, async () => {
    return request(app.getHttpServer())
      .get('/protected')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.email).toEqual(process.env.TEST_USER);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
