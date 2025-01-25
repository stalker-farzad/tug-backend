import { PaginationService } from 'src/common/services/pagination.service';
import { ResponseService } from 'src/common/services/response.service';
import { HandleException } from 'src/exceptions/error-exception.filter';
import { LoggerService } from 'src/common/services/logger.service';
import { CacheService } from 'src/database/redis/cache.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import {HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCompanyDto } from './dto/create.dto';
import { UpdateCompanyDto } from './dto/update.dto';
import { Company } from './entities/company.entity';
import { IndexCompanyDto } from './dto/index.dto';
import { StatusEnum } from 'src/enums/status.enum';
import { Repository } from 'typeorm';

/**
 * Service to handle the business logic for CRUD operations on companies.
 */
@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company) private companyRepository: Repository<Company>,
        private readonly paginationService: PaginationService,
        private readonly responseService: ResponseService,
        private cacheService: CacheService,
        private logger: LoggerService,
    ) { }

    /**
     * Create a new company.
     * @param createCompanyDto - Data for the new company.
     * @returns The created company.
     */
    async create(createCompanyDto: CreateCompanyDto): Promise<ResponseDto<Company>> {
        // Check if a company with the same name already exists
        const existingCompany = await this.companyRepository.findOne({ where: { name: createCompanyDto.name } });

        // If the company already exists, throw a ConflictException
        if (existingCompany) throw new HandleException('Company with this name already exists.', HttpStatus.CONFLICT);

        // Create new company from DTO
        const company = this.companyRepository.create(createCompanyDto);
        const savedCompany = await this.companyRepository.save(company);

        return this.responseService.success('Company created successfully', savedCompany);
    }

    /**
     * Finds a company by its ID.
     * If the company is not found, an exception is thrown.
     * @param id - The unique identifier of the company to find.
     * @returns A ResponseDto containing the found company data.
     */
    async findOne(id: string): Promise<ResponseDto<Company>> {

        // Retrieve the company from the repository based on the provided ID
        const company = await this.companyRepository.findOne({ where: { id } });

        // If the company is not found, throw an exception with a "Not Found" error
        if (!company) throw new HandleException('Company not found', HttpStatus.NOT_FOUND);

        return this.responseService.success('Company found successfully', company);
    }

    /**
     * Find all companies with pagination.
     * @param page - The page number for pagination.
     * @param limit - The number of companies per page.
     * @returns A list of companies and pagination info.
     */
    async findAll(page: number = 1, limit: number = 10): Promise<IndexCompanyDto<Company>> {

        // Try to get the data from cache first to improve performance
        const cacheKey = `companies:page:${page}:limit:${limit}`;
        const cachedCompanies = await this.cacheService.getCache<any>(cacheKey);

        // If cached data exists, return it with a success message
        if (cachedCompanies) {
            this.logger.warn("Companies retrieved from cache");
            return this.responseService.success('Companies retrieved from cache', cachedCompanies.result, cachedCompanies.meta);
        }

        // Fetch companies with pagination
        const skip = (page - 1) * limit;
        const take = limit;
        const [companies, total] = await this.companyRepository.findAndCount({ where: { status: StatusEnum.ACTIVE }, skip, take });

        // If no companies are found, return an error response with pagination metadata
        if (total === 0) throw new HandleException(`No companies found`, HttpStatus.NOT_FOUND, [], this.paginationService.createPaginationMeta(0, page, limit));

        // Create pagination metadata and prepare the result
        const meta = this.paginationService.createPaginationMeta(total, page, limit);
        const result = companies;

        // Cache the result for future requests to optimize performance
        await this.cacheService.setCache(cacheKey, { result, meta });

        return this.responseService.success('Companies fetched successfully', result, meta);
    }

    /**
     * Update an existing company.
     * @param id - The ID of the company to update.
     * @param updateCompanyDto - Data to update the company.
     * @returns The updated company.
     */
    async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<ResponseDto<Company>> {

        const company = await this.companyRepository.findOne({ where: { id } });

        // If the company is not found, throw an exception with a "Not Found" error
        if (!company) throw new HandleException('Company not found', HttpStatus.NOT_FOUND);

        // Update the company fields with the new values from the DTO
        Object.assign(company, updateCompanyDto);

        // Save the updated company to the database
        const updatedCompany = await this.companyRepository.save(company);

        return this.responseService.success('Company updated successfully', updatedCompany);
    }

    /**
   * Delete a company by ID.
   * @param id - The ID of the company to delete.
   * @returns A standardized response message indicating whether the deletion was successful.
   */
    async remove(id: string): Promise<any> {
        // Find the company by ID
        const company = await this.companyRepository.findOne({ where: { id } });

        // If the company is not found, throw an exception with a "Not Found" error
        if (!company) throw new HandleException('Company not found', HttpStatus.NOT_FOUND);

        // Invalidate related cache
        await this.cacheService.deleteByPattern(`companies:active:${id}`);

        // Remove the company from the database
        await this.companyRepository.softDelete(id);

        return this.responseService.success('Company deleted successfully', { id: id });
    }
}
