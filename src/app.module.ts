import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/mysql/database.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CacheModule } from './database/redis/redis.module';
import { CacheService } from './database/redis/cache.service';

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
    CacheService
  ],
  exports: [CacheService], 
})
export class AppModule {}
