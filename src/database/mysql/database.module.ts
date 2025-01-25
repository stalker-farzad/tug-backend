import { envValidationSchema } from 'src/config/env.validation';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from 'src/config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

/**
 * @module DatabaseModule
 *
 * Configures MySQL connection with TypeORM, supports migrations, auto-loads entities, and enables seeding data.
 * Loads settings from environment variables using `ConfigService`.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true, 
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        autoLoadEntities: true, // Automatically load entities from modules
        synchronize: configService.get<boolean>('database.synchronize'), // Do not use true in production
        logging: configService.get<boolean>('database.logging'),
        migrations: [__dirname + '/migrations/*.ts'],
        seeds: [__dirname + "/seeders/*.seeder.ts"],
        entities: [__dirname + '/../../modules/**/**/*.entity{.ts,.js}'],
        migrationsRun: true,
        cache: true, // Enable caching for better performance
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [

  ],
})
export class DatabaseModule {}
