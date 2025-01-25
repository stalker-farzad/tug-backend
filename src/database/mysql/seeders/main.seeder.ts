import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { SeederService } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule); // Create application context with SeederModule

  const seederService = app.get(SeederService); // Retrieve SeederService

  try {
    console.log('Starting seeding process...');
    await seederService.onModuleInit();
    console.log('Seeding process completed successfully.');
  } catch (error) {
    console.error('Error during seeding process:', error);
  } finally {
    await app.close(); // Close the application context after execution
  }
}

bootstrap();
