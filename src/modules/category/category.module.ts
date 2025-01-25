import { CategoryController } from './category.controller';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

/**
 * Module that encapsulates everything related to the category.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService ],
})
export class CategoryModule {}
