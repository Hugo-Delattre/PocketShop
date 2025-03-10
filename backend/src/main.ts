import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';

const logStream = fs.createWriteStream('/app/logs/app.log', { flags: 'a'});
Logger.overrideLogger({
  log: (msg) => logStream.write(`[LOG] ${msg}\n`),
  error: (msg) => logStream.write(`[ERROR] ${msg}\n`),
  warn: (msg) => logStream.write(`[WARN] ${msg}\n`),
  debug: (msg) => logStream.write(`[DEBUG] ${msg}\n`),
  verbose: (msg) => logStream.write(`[VERBOSE] ${msg}\n`),
});

config({ path: '.env.local' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:3002',
    'http://209.38.247.123:3000',
    'http://209.38.247.123:8080',
    'http://209.38.247.123:3002',
    'https://trinity-backoffice.vercel.app',
    'https://trinity-backoffice-3h8fls8jg-andydcks-projects.vercel.app'
  ];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Trinity')
    .setDescription('Trinity API')
    .setVersion('1.0')
    .addTag('trinity')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'bearer',
    )
    .addSecurityRequirements('bearer')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      security: [{ bearer: [] }],
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
