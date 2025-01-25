import { PaginationService } from "src/common/services/pagination.service";
import { ResponseService } from "src/common/services/response.service";
import { HandleException } from "src/exceptions/error-exception.filter";
import { LoggerService } from "src/common/services/logger.service";
import { CacheService } from "src/database/redis/cache.service";
import { HttpStatus, Injectable} from "@nestjs/common";
import { Category } from "./entities/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { StatusEnum } from "src/enums/status.enum";
import { IndexCategoryDto } from "./dto/index.dto";
import { Repository } from "typeorm";

/**
 * Service to handle the business logic for CRUD operations on categories.
 */
@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        private readonly responseService: ResponseService,
        private readonly paginationService: PaginationService,
        private cacheService: CacheService,
        private logger: LoggerService,
    ) { }

    /**
       * Find all categories with pagination.
       * @param page - The page number for pagination.
       * @param limit - The number of categories per page.
       * @returns A list of categories and pagination info.
    */
    async findAll(page: number = 1, limit: number = 10): Promise<IndexCategoryDto> {
        // Try to get the data from cache first to improve performance
        const cacheKey = `categories:active:page:${page}:limit:${limit}`;
        const cachedCategories = await this.cacheService.getCache<any>(cacheKey);

        // If cached data exists, return it with a success message
        if (cachedCategories) {
            this.logger.warn("Categories retrieved from cache");
            return this.responseService.success('Categories retrieved from cache', cachedCategories.result, cachedCategories.meta);
        }

        // Fetch categories with pagination from the database
        const skip = (page - 1) * limit;
        const take = limit;
        const [categories, total] = await this.categoryRepository.findAndCount({ where: { status: StatusEnum.ACTIVE }, skip, take });

        // If no categories are found, return an error response with pagination metadata
        if (total === 0) throw new HandleException(`No categories found`,HttpStatus.NOT_FOUND,[],this.paginationService.createPaginationMeta(0, page, limit));

        // Create pagination metadata and prepare the result
        const meta = this.paginationService.createPaginationMeta(total, page, limit);
        const result = categories;

        // Cache the result for future requests to optimize performance
        await this.cacheService.setCache(cacheKey, { result, meta });

        // Return the categories and metadata in a success response
        return this.responseService.success('Categories fetched successfully', result, meta);
    }
}