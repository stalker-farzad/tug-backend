import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { IndexSubCategoryDto } from './dto/index.dto';
import { StatusEnum } from 'src/enums/status.enum';
import { ResponseService } from 'src/common/services/response.service';

describe('SubCategoryController', () => {
  let app: INestApplication;
  let subCategoryService: SubCategoryService;

  beforeEach(async () => {
    const mockSubCategoryService = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubCategoryController],
      providers: [
        {
          provide: SubCategoryService,
          useValue: mockSubCategoryService,
        },
        {
          provide: ResponseService,
          useValue: { createResponse: jest.fn((data) => data) },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    subCategoryService = module.get<SubCategoryService>(SubCategoryService);
  });

  it('should return subcategories with pagination', async () => {
    const page = 1;
    const limit = 10;
    const mockSubCategories = [
      {
        id: 'd2c7f79b-bd87-4c4e-bbd1-8f6f2ea7baf7',
        name: 'Category 1',
        status: StatusEnum.ACTIVE,
        categoryId: "d2c7f79b-bd87-4c4e-bbd1-8f6f2ea7baf7",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      },
      {
        id: '3a7f3b8d-6d5f-48a1-b915-b238e53734d9',
        name: 'Category 2',
        status: StatusEnum.INACTIVE,
        categoryId: "d2c7f79b-bd87-4c4e-bbd1-8f6f2ea7baf7",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      },
    ];

    const mockResponse: IndexSubCategoryDto = {
      succeed: true,
      message: 'Categories retrieved successfully',
      result: mockSubCategories,
      meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
    };

    jest.spyOn(subCategoryService, 'findAll').mockResolvedValue(mockResponse);

    const response = await request(app.getHttpServer())
      .get('/sub-category/index')
      .query({ page, limit })
      .expect(200);

    expect(response.body.result.length).toBe(mockSubCategories.length);
    expect(response.body.meta.total).toBe(mockSubCategories.length);
    expect(response.body.result[0].id).toBeDefined();
    expect(response.body.result[0].status).toBe(StatusEnum.ACTIVE);
  });

  it('should return 500 on error', async () => {
    jest.spyOn(subCategoryService, 'findAll').mockRejectedValue(new Error('Internal Error'));

    const response = await request(app.getHttpServer())
      .get('/sub-category/index')
      .expect(500);

    expect(response.body.message).toBe('Internal server error');
  });

  afterAll(async () => {
    await app.close();
  });
});
