import { Subcategory } from './entities/sub-category.entity';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryService } from './sub-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

/**
 * Module that encapsulates everything related to the sub-category.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Subcategory]) ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}
