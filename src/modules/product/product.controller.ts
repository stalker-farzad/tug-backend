import { ApiBadRequestResponse, ApiBasicAuth, ApiConflictResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto/response.dto';
import { ShowProductDto } from './dto/show.dto';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create.dto';
import { UpdateProductDto } from './dto/update.dto';
import { Product } from './entities/product.entity';
import { IndexProducteDto } from './dto/index.dto';

/**
 * Controller for managing product operations
 */
@ApiTags('Product') 
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Create a new product
   * @param createProductDto - The product data to create
   * @returns The created product
   */
  @Post('create')
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 200, description: 'Product successfully created', type: ShowProductDto })
  @ApiConflictResponse({description: 'A product with this name already exists.'})
  @ApiBadRequestResponse({description: 'Invalid input data.'})
  async create(@Body() createProductDto: CreateProductDto): Promise<ResponseDto<Product>> {
    return this.productService.create(createProductDto);
  }

  /**
   * Get all products
   * @returns A list of products
   */
  @Get('index')
  @ApiBasicAuth()
  @ApiOperation({ 
    summary: 'Get all products with pagination and barcode search',
    description: 'Retrieve a list of all products with the option to search by barcode. Supports pagination.'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'barcode', required: false, type: String, example: "123456789", description: 'Barcode search' })
  @ApiResponse({ status: 200, description: 'List of products', type: IndexProducteDto})
  @ApiResponse({status: 404, description: 'No products found with the given barcode'})
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10, 
    @Query('barcode') barcode?: string
  ): Promise<IndexProducteDto<Product>> {
    return this.productService.findAll(page, limit, barcode);
  }

  /**
   * Get a single product by ID
   * @param id - The ID of the product to retrieve
   * @returns The product data
   */
  @Get('show/:id')
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product data', type: ShowProductDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string): Promise<ResponseDto<Product>> {
    return this.productService.findOne(id);
  }

  /**
   * Update an existing product
   * @param id - The ID of the product to update
   * @param updateProductDto - The data to update
   * @returns The updated product
   */
  @Put('update/:id')
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({ status: 200, description: 'Product successfully updated', type: ShowProductDto })
  @ApiConflictResponse({description: 'A product with this name already exists.'})
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ResponseDto<Product>> {
    return this.productService.update(id, updateProductDto);
  }

  /**
   * Delete a product
   * @param id - The ID of the product to delete
   * @returns A success message
   */
  @Delete('destroy/:id')
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: 200, description: 'Product successfully deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: string): Promise<any> {
    return this.productService.remove(id);
  }
}