import { ApiBasicAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { Controller, Get, Query } from "@nestjs/common";
import { IndexCategoryDto } from "./dto/index.dto";

/**
 * Controller for managing category operations
 */
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  /**
   * Get all categories
   * @returns A list of categories
   */
  @Get('index')
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Get all categories with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Number of items per page' })
  @ApiResponse({ status: 200, description: 'List of categories with pagination metadata', type: IndexCategoryDto })
  @ApiResponse({ status: 404, description: 'No categories found' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10): Promise<IndexCategoryDto> {
    return this.categoryService.findAll(Number(page), Number(limit));
  }
}