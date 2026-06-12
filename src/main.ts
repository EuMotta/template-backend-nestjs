import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './utils/db-response-error';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const DEFAULT_PORT = 3001;
const DEFAULT_CORS_ORIGIN = 'http://localhost:3000';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Nestjs example')
    .setDescription('The template API by motta')
    .setVersion('1.0')
    .addTag('motta')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    useGlobalPrefix: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) =>
    origin.trim(),
  ) || [DEFAULT_CORS_ORIGIN];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error(
            `Origin ${origin} not allowed by CORS policy. Allowed origins: ${allowedOrigins.join(', ')}`,
          ),
        );
      }
    },
    credentials: true,
  });

  const port = Number(process.env.PORT) || DEFAULT_PORT;
  await app.listen(port);
}

void bootstrap();
