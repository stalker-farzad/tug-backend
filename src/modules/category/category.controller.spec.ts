import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { IndexCategoryDto } from './dto/index.dto';
import { v4 as uuidv4 } from 'uuid';
import { StatusEnum } from 'src/enums/status.enum';
import { ResponseService } from 'src/common/services/response.service';

describe('CategoryController', () => {
  let app: INestApplication;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const mockCategoryService = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
        {
          provide: ResponseService,
          useValue: { createResponse: jest.fn() },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should return categories successfully', async () => {
    const mockCategories = [
      {
        id: 'd2c7f79b-bd87-4c4e-bbd1-8f6f2ea7baf7',
        name: 'Category 1',
        status: StatusEnum.ACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      },
      {
        id: '3a7f3b8d-6d5f-48a1-b915-b238e53734d9',
        name: 'Category 2',
        status: StatusEnum.INACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      },
    ];
  
    const mockResponse: IndexCategoryDto = {
      succeed: true,
      message: 'Categories retrieved successfully',
      result: mockCategories,
      meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
    };
  
    jest.spyOn(categoryService, 'findAll').mockResolvedValue(mockResponse);
  
    const response = await request(app.getHttpServer())
      .get('/category/index')
      .query({ page: 1, limit: 10 })
      .expect(200);
  
    expect(response.body.result).toEqual(mockCategories);
    expect(response.body.meta.total).toBe(2);
    expect(response.body.succeed).toBe(true);
    expect(response.body.message).toBe('Categories retrieved successfully');
  });
  
  

  it('should return 500 on internal error', async () => {
    jest.spyOn(categoryService, 'findAll').mockRejectedValue(new Error('Internal Error'));

    const response = await request(app.getHttpServer())
      .get('/category/index')
      .expect(500);

    expect(response.body.message).toBe('Internal server error');
  });

  afterAll(async () => {
    await app.close();
  });
});
