import { PaginationService } from 'src/common/services/pagination.service';
import { ResponseService } from 'src/common/services/response.service';
import { HandleException } from 'src/exceptions/error-exception.filter';
import { Subcategory } from '../sub-category/entities/sub-category.entity';
import { LoggerService } from 'src/common/services/logger.service';
import { CacheService } from 'src/database/redis/cache.service';
import { Category } from '../category/entities/category.entity';
import { Company } from '../company/entities/company.entity';
import { Product } from '../product/entities/product.entity';
import { CreateProductDto } from '../product/dto/create.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { ProductShowResponseDto } from './dto/show.dto';
import { HttpStatus, Injectable} from '@nestjs/common';
import { UpdateProductDto } from './dto/update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { IndexProducteDto } from './dto/index.dto';
import { Not, Repository } from 'typeorm';

/**
 * Service to handle the business logic for CRUD operations on products.
 */
@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Company) private companyRepository: Repository<Company>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        @InjectRepository(Subcategory) private subCategoryRepository: Repository<Subcategory>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
        private readonly paginationService: PaginationService,
        private readonly responseService: ResponseService,
        private cacheService: CacheService,
        private logger: LoggerService,
    ) { }

    /**
     * Create a new product.
     * @param createProductDto - Data for the new product.
     * @returns The created product.
     */
    async create(createProductDto: CreateProductDto): Promise<ResponseDto<Product>> {
        const { categoryId, companyId, subcategoryId } = createProductDto;

        // Check if a product with the same name already exists
        const existingProduct = await this.productRepository.findOne({ where: { name: createProductDto.name } });
        if (existingProduct) throw new HandleException('Product with this name already exists.', HttpStatus.CONFLICT);

        // Check if a product with the same barcode already exists
        const existingBarcode = await this.productRepository.findOne({ where: { barcode: createProductDto.barcode } });
        if (existingBarcode) throw new HandleException('Product with this barcode already exists.', HttpStatus.CONFLICT);

        // Validate categoryId if provided
        if (categoryId) {
            const categoryExists = await this.categoryRepository.findOne({ where: { id: categoryId } });
            if (!categoryExists) throw new HandleException('Category with the provided ID does not exist', HttpStatus.NOT_FOUND);
        }

        // Validate companyId if provided
        if (companyId) {
            const companyExists = await this.companyRepository.findOne({ where: { id: companyId } });
            if (!companyExists) throw new HandleException('Company with the provided ID does not exist', HttpStatus.NOT_FOUND);
        }

        // Validate subCategoryId if provided
        if (subcategoryId) {
            const subCategoryExists = await this.subCategoryRepository.findOne({ where: { id: subcategoryId } });
            if (!subCategoryExists) throw new HandleException('Subcategory with the provided ID does not exist', HttpStatus.NOT_FOUND);
        }

        // Create new product from DTO
        const product = this.productRepository.create(createProductDto);
        const savedProduct = await this.productRepository.save(product);

        // Create response using ResponseService
        return this.responseService.success('Product created successfully', savedProduct);
    }

    /**
     * Find a product by ID.
     * @param id - The ID of the product.
     * @returns The found product or a message if not found.
     */
    async findOne(id: string): Promise<ResponseDto<Product>> {
        const product = await this.productRepository.findOne({ where: { id }, relations: ['company', 'category', 'subcategory'] });

        // If the product is not found, throw an exception with a "Not Found" error
        if (!product) throw new HandleException('Product not found', HttpStatus.NOT_FOUND);
        const response = plainToClass(ProductShowResponseDto, product, { excludeExtraneousValues: true });

        return this.responseService.success('Product found successfully', response);
    }

    /**
     * Find all products with pagination and optional barcode search.
     * @param page - The page number for pagination.
     * @param limit - The number of products per page.
     * @param barcode - Optional barcode to search for products.
     * @returns A list of products and pagination info.
     */
    async findAll(page: number = 1, limit: number = 10, barcode?: string): Promise<IndexProducteDto<Product>> {
        // Try to get data from cache first
        const cacheKey = `products:page:${page}:limit:${limit}:barcode:${barcode || ''}`;
        const cachedProducts = await this.cacheService.getCache<any>(cacheKey);

        // If cached data exists, return it with a success message
        if (cachedProducts) {
            this.logger.warn("Products retrieved from cache");
            return this.responseService.success('Products retrieved from cache', cachedProducts.result, cachedProducts.meta);
        }

        // Build the query for fetching products
        const skip = (page - 1) * limit;
        const take = limit;
        const queryBuilder = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.company', 'company')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subcategory', 'subcategory');

        // If barcode is provided, add a where clause for barcode search
        if (barcode) queryBuilder.andWhere('product.barcode LIKE :barcode', { barcode: `%${barcode}%` });

        // Fetch products with pagination
        queryBuilder.skip(skip).take(take);
        const [products, total] = await queryBuilder.getManyAndCount();

        // If no products found with the given barcode, return a custom message
        if (barcode && total === 0) throw new HandleException(`No products found with barcode: ${barcode}`, HttpStatus.NOT_FOUND)

        // Create pagination metadata and prepare the result
        const meta = this.paginationService.createPaginationMeta(total, page, limit);
        const result = products;

        // Cache the result
        await this.cacheService.setCache(cacheKey, { result, meta });

        return this.responseService.success('Products fetched successfully', result, meta);
    }

    /**
     * Update an existing product.
     * @param id - The ID of the product to update.
     * @param updateProductDto - Data to update the product.
     * @returns The updated product.
     */
    async update(id: string, updateProductDto: UpdateProductDto): Promise<ResponseDto<Product>> {

        const { categoryId, companyId, subcategoryId } = updateProductDto;

        // Check if the product exists
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) throw new HandleException('Product not found', HttpStatus.NOT_FOUND);

        // Validate categoryId if provided
        if (categoryId) {
            const categoryExists = await this.categoryRepository.findOne({ where: { id: categoryId } });
            if (!categoryExists) throw new HandleException('Category with the provided ID does not exist', HttpStatus.NOT_FOUND);
        }

        // Validate companyId if provided
        if (companyId) {
            const companyExists = await this.companyRepository.findOne({ where: { id: companyId } });
            if (!companyExists) throw new HandleException('Company with the provided ID does not exist', HttpStatus.NOT_FOUND);
        }

        // Validate subCategoryId if provided
        if (subcategoryId) {
            const subCategoryExists = await this.subCategoryRepository.findOne({ where: { id: subcategoryId } });
            if (!subCategoryExists) throw new HandleException('Subcategory with the provided ID does not exist', HttpStatus.NOT_FOUND);
        }

        // Update the product fields with the new values from the DTO
        Object.assign(product, updateProductDto);

        // Save the updated product to the database
        const updatedProduct = await this.productRepository.save(product);
        return this.responseService.success('Product updated successfully', updatedProduct);
    }

    /**
     * Delete a product by ID.
     * @param id - The ID of the product to delete.
     * @returns A standardized response message indicating whether the deletion was successful.
     */
    async remove(id: string): Promise<any> {
        // Find the product by ID
        const product = await this.productRepository.findOne({ where: { id } });

        // If the product is not found, throw an exception with a "Not Found" error
        if (!product) throw new HandleException('Product not found', HttpStatus.NOT_FOUND);

        // Invalidate related cache
        await this.cacheService.deleteByPattern(`products:active:${id}`);

        // Remove the product from the database
        await this.productRepository.softDelete(id);

        return this.responseService.success('Product deleted successfully', { id: id });
    }
}