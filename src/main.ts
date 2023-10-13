import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabasePresets } from './database.presets';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as bodyParser from 'body-parser'
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));
  app.use(bodyParser.json({ limit: '15mb' }));
  app.enableCors();

  await DatabasePresets(app);
  const configService: ConfigService = app.get(ConfigService);
  const publicDirectory = configService.get('PUBLIC_DIRECTORY')
  const locallyDirectory = join(__dirname, publicDirectory);
  app.useStaticAssets(locallyDirectory, { prefix: publicDirectory });

  const PORT = process.env.WEBSERVER_PORT || 6000;
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
bootstrap();
