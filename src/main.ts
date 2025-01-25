import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstrap function: Initializes the NestJS application and sets up middleware, validation, logging, and event listeners.
 * @throws {Error} Throws error during application startup if any configuration fails
 */
async function bootstrap() {
  // Create an instance of the application using the AppModule configuration.
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  // Retrieve the logger instance using the 'LOGGER' token
  const logger = new Logger('Bootstrap');

  try {
    // Initialize application configuration
    app.setGlobalPrefix('api/v1'); // Set the global API prefix to 'api/v1'

    // Global validation pipe configuration
    app.useGlobalPipes(new ValidationPipe({
      transform: true, 
      whitelist: true, 
      forbidNonWhitelisted: true,
    }));

    // Enable CORS with specific configuration
    app.enableCors({
      origin: process.env.CORS_ORIGIN || '*', // Allow requests from specific origins or all origins
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    });

    // Define the port for the application to listen on
    const port = +process.env.APP_PORT || 3000; 
    await app.listen(port); 

    logger.verbose(`Application is running on ${process.env.APP_URL}`);
  } catch (error) {
    logger.error('Error during application startup', { error });
  }
}
bootstrap();
