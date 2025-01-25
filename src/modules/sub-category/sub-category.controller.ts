import { ApiBasicAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SubCategoryService } from "./sub-category.service";
import { Controller, Get, Query } from "@nestjs/common";
import { IndexSubCategoryDto } from "./dto/index.dto";

/**
 * Controller for managing sub-category operations
 */
@ApiTags('SubCategory')
@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) { }

  /**
 * Get all sub-categories
 * @returns A list of sub-categories
 */
  @Get('index')
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Get all subcategories with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Number of items per page' })
  @ApiResponse({ status: 200, description: 'List of subcategories with pagination metadata', type: IndexSubCategoryDto})
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<IndexSubCategoryDto> {
    return this.subCategoryService.findAll(Number(page), Number(limit));
  }
}