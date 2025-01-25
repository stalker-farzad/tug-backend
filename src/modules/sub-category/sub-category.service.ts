import { PaginationService } from "src/common/services/pagination.service";
import { ResponseService } from "src/common/services/response.service";
import { HandleException } from "src/exceptions/error-exception.filter";
import { LoggerService } from "src/common/services/logger.service";
import { CacheService } from "src/database/redis/cache.service";
import { Subcategory } from "./entities/sub-category.entity";
import { HttpStatus, Injectable} from "@nestjs/common";
import { IndexSubCategoryDto } from "./dto/index.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { StatusEnum } from "src/enums/status.enum";
import { Repository } from "typeorm";

/**
 * Service to handle the business logic for CRUD operations on sub-categories.
 */
@Injectable()
export class SubCategoryService {
    constructor(
        @InjectRepository(Subcategory) private subcategoryRepository: Repository<Subcategory>,
        private readonly paginationService: PaginationService,
        private readonly responseService: ResponseService,
        private readonly cacheService: CacheService,
        private logger: LoggerService,
    ) { }

    /**
     * Find all subcategories with pagination.
     * @param page - The page number for pagination.
     * @param limit - The number of subcategories per page.
     * @returns A list of subcategories and pagination info.
     */
    async findAll(page: number = 1, limit: number = 10): Promise<IndexSubCategoryDto> {

        // Try to get the data from cache first to improve performance
        const cacheKey = `subcategories:active:page:${page}:limit:${limit}`;
        const cachedSubcategories = await this.cacheService.getCache<any>(cacheKey);

        // If cached data exists, return it with a success message
        if (cachedSubcategories) {
            this.logger.warn("Subcategories retrieved from cache");
            return this.responseService.success('Subcategories retrieved from cache', cachedSubcategories.result, cachedSubcategories.meta);
        }

        // Fetch subcategories from the database with pagination
        const skip = (page - 1) * limit;
        const take = limit;
        const [subcategories, total] = await this.subcategoryRepository.findAndCount({ where: { status: StatusEnum.ACTIVE}, skip, take });

        // If no subcategories are found, return an error response with pagination metadata
        if (total === 0) throw new HandleException(`No subcategories found`, HttpStatus.NOT_FOUND, [], this.paginationService.createPaginationMeta(0, page, limit));

        // Create pagination metadata and prepare the result
        const meta = this.paginationService.createPaginationMeta(total, page, limit);
        const result = subcategories.map(subcategory => ({
            id: subcategory.id,
            name: subcategory.name,
            status: subcategory.status,
            categoryId: subcategory.categoryId,
            createdAt: subcategory.createdAt,
            updatedAt: subcategory.updatedAt,
        }));

        // Cache the result for future requests to optimize performance
        await this.cacheService.setCache(cacheKey, { result, meta });

        // Return the subcategories and metadata in a success response
        return this.responseService.success('Subcategories fetched successfully', result, meta);
    }
}