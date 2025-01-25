import { Subcategory } from 'src/modules/sub-category/entities/sub-category.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorySeeder } from './category.seeder';
import { SeederService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category,Subcategory]), // Register entities needed for seeding
  ],
  providers: [SeederService, CategorySeeder], // Register services
  exports: [SeederService], // Export SeederService for external use
})
export class SeederModule {}
