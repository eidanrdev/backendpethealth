import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:8081', // Cambia esto a la URL de tu aplicación React Native
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      const message = errors.map(error => ({
        field: error.property,
        constraints: Object.values(error.constraints),
      }));
      return new BadRequestException(message);
    },
  }));

  const config = new DocumentBuilder()
    .setTitle('API de Tu Proyecto')
    .setDescription('Descripción de la API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('pets')
    .addTag('users')
    .addTag('vaccinations')
    .addTag('vaccination-records')
    .addTag('treatments')
    .addTag('consultations')
    .addTag('activities')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000; 
  await app.listen(port);
}

bootstrap();
