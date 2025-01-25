import { Subcategory } from '../sub-category/entities/sub-category.entity';
import { Category } from '../category/entities/category.entity';
import { Company } from '../company/entities/company.entity';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { Module } from '@nestjs/common';

/**
 * Module that encapsulates everything related to the product.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Product , Category , Company , Subcategory])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
