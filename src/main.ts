import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './env';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({ origin: env.FRONTEND_URL, credentials: true });
  app.setGlobalPrefix('api');
  await app.listen(env.PORT);
  
}
bootstrap();
