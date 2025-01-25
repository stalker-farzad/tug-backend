
import { HandleException } from 'src/exceptions/error-exception.filter';
import { Test, TestingModule } from '@nestjs/testing';
import { SubCategoryService } from './sub-category.service';
import { Subcategory } from './entities/sub-category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoggerService } from 'src/common/services/logger.service';
import { CacheService } from 'src/database/redis/cache.service';
import { ResponseService } from 'src/common/services/response.service';
import { StatusEnum } from 'src/enums/status.enum';
import { PaginationService } from 'src/common/services/pagination.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';


describe('SubCategoryService', () => {
  let service: SubCategoryService;
  let mockSubCategoryRepository: jest.Mocked<Repository<Subcategory>>;
  let mockCacheService: jest.Mocked<CacheService>;
  let mockResponseService: jest.Mocked<ResponseService>;
  let mockLoggerService: jest.Mocked<LoggerService>;
  let mockPaginationService: jest.Mocked<PaginationService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubCategoryService,
        {
          provide: getRepositoryToken(Subcategory),
          useClass: Repository,
        },
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn().mockResolvedValue(null),
            setCache: jest.fn().mockResolvedValue(true),
          },
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
          provide: LoggerService,
          useValue: { error: jest.fn(), warn: jest.fn() },
        },
        {
          provide: PaginationService,
          useValue: {
            createPaginationMeta: jest.fn().mockReturnValue({ totalItems: 0, currentPage: 1, itemsPerPage: 10 }),
          },
        },
      ],
    }).compile();

    service = module.get<SubCategoryService>(SubCategoryService);
    mockSubCategoryRepository = module.get(getRepositoryToken(Subcategory)) as jest.Mocked<Repository<Subcategory>>;
    mockCacheService = module.get(CacheService) as jest.Mocked<CacheService>;
    mockResponseService = module.get(ResponseService) as jest.Mocked<ResponseService>;
    mockLoggerService = module.get(LoggerService) as jest.Mocked<LoggerService>;
    mockPaginationService = module.get(PaginationService) as jest.Mocked<PaginationService>;
  });

  it('should return subcategories from database if not cached', async () => {
    const page = 1;
    const limit = 10;
    const subcategories = [{
      id: uuidv4(),
      name: 'SubCategory 1',
      status: StatusEnum.ACTIVE,
      categoryId: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }];
    const total = 1;
    const meta = { totalItems: 1, currentPage: 1, itemsPerPage: 10 };

    // Mocking repository and response service
    mockSubCategoryRepository.findAndCount = jest.fn().mockResolvedValue([subcategories, total]);
    mockResponseService.success = jest.fn().mockReturnValue({
      succeed: true,
      message: 'Subcategories fetched successfully',
      result: subcategories,
      meta,
    });

    const result = await service.findAll(page, limit);

    // Assert the result matches the expected output
    expect(result).toEqual({
      succeed: true,
      message: 'Subcategories fetched successfully',
      result: subcategories,
      meta,
    });
  });

  it('should throw an exception if no subcategories found', async () => {
    const page = 1;
    const limit = 10;
    const subcategories = [];
    const total = 0;

    // Mocking repository to return no subcategories
    mockSubCategoryRepository.findAndCount = jest.fn().mockResolvedValue([subcategories, total]);

    // Adjust to expect HandleException instead of InternalServerErrorException
    await expect(service.findAll(page, limit)).rejects.toThrow(HandleException);
  });
});