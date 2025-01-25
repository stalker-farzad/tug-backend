import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/mysql/database.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CacheModule } from './database/redis/redis.module';
import { CacheService } from './database/redis/cache.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { BasicAuthGuard } from './guards/basic.guard';
import { ResponseService } from './common/services/response.service';
import { ValidationExceptionFilter } from './pipes/exception.pipe';
import { ApiResponseInterceptor } from './interceptors/api-response.interceptor';
import { LoggerService } from './common/services/logger.service';

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
    ResponseService,
    LoggerService,
    CacheService
  ],
  exports: [CacheService,ResponseService,LoggerService], 
})
export class AppModule {}
