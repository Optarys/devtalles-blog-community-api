import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'BLOG-API',
      logLevels: ['log', 'error', 'warn', 'verbose'],
    }),
  });

  useSwagger(app);
  
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(process.env.PORT ?? 3000);
}

async function useSwagger(app: INestApplication<any>) {
  const configService = app.get(ConfigService);

  const swaggerUser = configService.get<string>('SWAGGER_USER', 'admin');
  const swaggerPass = configService.get<string>('SWAGGER_PASS', '12345');

  app.use(
    ['/swagger', '/swagger-json'], // protege tanto UI como JSON
    basicAuth({
      challenge: true,
      users: { [swaggerUser]: swaggerPass },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Optarys Devtalles Blog')
    .setDescription('Documentacion de API')
    .setVersion('1.0')
    .addTag('Controladores Principales')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);
}

bootstrap();
