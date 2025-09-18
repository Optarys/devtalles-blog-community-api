import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'BLOG-API',
      logLevels: ['log', 'error', 'warn', 'verbose'],
    }),
  });

   app.enableCors({
    origin: [
      'http://localhost:3000',                // 🔹 local dev
      'https://symmetrical-bassoon-7qp667v7xwh7ww.github.dev',     // 🔹 Codespaces
      'https://devtalles-blog-community-web.onrender.com', 
      'https://dev.to'  // 🔹 producción
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // 🔑 permite cookies y auth headers
  });

  app.use(cookieParser());

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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Ingresa tu token JWT aquí',
        in: 'header'
      },
      'JWT-auth', // nombre del security scheme
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Aplica el security scheme globalmente
  document.components!.securitySchemes = {
    'JWT-auth': {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  };
  document.security = [{ 'JWT-auth': [] }];

  SwaggerModule.setup('swagger', app, document);
}

bootstrap();
