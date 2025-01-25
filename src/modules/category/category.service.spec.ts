import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { ResponseService } from 'src/common/services/response.service';
import { PaginationService } from 'src/common/services/pagination.service';
import { LoggerService } from 'src/common/services/logger.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { StatusEnum } from 'src/enums/status.enum';
import { HandleException } from 'src/exceptions/error-exception.filter';
import { CacheService } from 'src/database/redis/cache.service';
import { v4 as uuidv4 } from 'uuid';

describe('CategoryService', () => {
  let service: CategoryService;
  let mockCategoryRepository: Repository<Category>;
  let mockResponseService: ResponseService;
  let mockPaginationService: PaginationService;
  let mockLoggerService: LoggerService;
  let mockCacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
        {
          provide: ResponseService,
          useValue: {
            success: jest.fn().mockImplementation((message, result, meta) => ({
              succeed: true,
              message,
              result,
              meta,
            })),
            error: jest.fn().mockImplementation((message, errorDetails, meta) => ({
              succeed: false,
              message,
              result: errorDetails,
              meta,
            })),
          },
        },
        {
          provide: PaginationService,
          useValue: { createPaginationMeta: jest.fn() },
        },
        {
          provide: LoggerService,
          useValue: { warn: jest.fn() },
        },
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn().mockResolvedValue(null),
            setCache: jest.fn().mockResolvedValue(true), 
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    mockCategoryRepository = module.get(getRepositoryToken(Category));
    mockResponseService = module.get(ResponseService);
    mockPaginationService = module.get(PaginationService);
    mockLoggerService = module.get(LoggerService);
    mockCacheService = module.get(CacheService);
  });

  it('should return categories from database if not cached', async () => {
    const page = 1;
    const limit = 10;
    const categories = [{ id: uuidv4(), name: 'Category 1', status: StatusEnum.ACTIVE }];
    const total = 1;
    const meta = { totalItems: 1, currentPage: 1, itemsPerPage: 10 };

    // Mocking repository and pagination
    mockCategoryRepository.findAndCount = jest.fn().mockResolvedValue([categories, total]);
    mockPaginationService.createPaginationMeta = jest.fn().mockReturnValue(meta);
    mockResponseService.success = jest.fn().mockReturnValue({ succeed: true, message: 'Categories fetched successfully', result: categories, meta });

    const result = await service.findAll(page, limit);

    expect(mockCategoryRepository.findAndCount).toHaveBeenCalledWith({
      where: { status: StatusEnum.ACTIVE },
      skip: 0,
      take: 10,
    });
    expect(mockCacheService.setCache).toHaveBeenCalledWith(
      `categories:active:page:${page}:limit:${limit}`,
      { result: categories, meta }
    );
    expect(mockResponseService.success).toHaveBeenCalledWith('Categories fetched successfully', categories, meta);
    expect(result).toEqual({ succeed: true, message: 'Categories fetched successfully', result: categories, meta });
  });

  it('should throw an exception if no categories found', async () => {
    const page = 1;
    const limit = 10;
    const categories = [];
    const total = 0;

    // Mocking repository to return no categories
    mockCategoryRepository.findAndCount = jest.fn().mockResolvedValue([categories, total]);
    mockPaginationService.createPaginationMeta = jest.fn().mockReturnValue({ totalItems: 0, currentPage: 1, itemsPerPage: 10 });

    await expect(service.findAll(page, limit)).rejects.toThrow(HandleException);
  });
});
