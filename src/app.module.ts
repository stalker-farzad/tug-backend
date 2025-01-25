import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/mysql/database.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CacheModule } from './database/redis/redis.module';
import { CacheService } from './database/redis/cache.service';
import { APP_GUARD } from '@nestjs/core';
import { BasicAuthGuard } from './guards/basic.guard';

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
    CacheService
  ],
  exports: [CacheService], 
})
export class AppModule {}
