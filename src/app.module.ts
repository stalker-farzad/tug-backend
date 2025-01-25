import { ApiResponseInterceptor } from './interceptors/api-response.interceptor';
import { SubCategoryModule } from './modules/sub-category/sub-category.module';
import { PaginationService } from './common/services/pagination.service';
import { ResponseService } from './common/services/response.service';
import { CategoryModule } from './modules/category/category.module';
import { ValidationExceptionFilter } from './pipes/exception.pipe';
import { DatabaseModule } from './database/mysql/database.module';
import { CompanyModule } from './modules/company/company.module';
import { LoggerService } from './common/services/logger.service';
import { ProductModule } from './modules/product/product.module';
import { CacheService } from './database/redis/cache.service';
import { CacheModule } from './database/redis/redis.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { BasicAuthGuard } from './guards/basic.guard';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';

/**
 * The main module of the application, responsible for importing and providing various services and features.
 * It integrates modules for logging, database, wallet management, token handling, and IPFS (InterPlanetary File System).
 * Additionally, it sets up a global interceptor to format API responses uniformly.
 */
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),
    DatabaseModule,
    RedisModule,
    CacheModule,
    CommandModule,
    SubCategoryModule,
    CategoryModule,
    CompanyModule,
    ProductModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: BasicAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ApiResponseInterceptor, 
    },
    PaginationService,
    ResponseService,
    LoggerService,
    CacheService
  ],
  exports: [
    LoggerService , 
    ResponseService , 
    PaginationService , 
    CacheService
  ], 
})
export class AppModule {}
