import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';

/**
 * Module that encapsulates everything related to the company.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Company])
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
