import { ApiBadRequestResponse, ApiBasicAuth, ApiConflictResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Put, Delete, Query} from '@nestjs/common';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CreateCompanyDto } from './dto/create.dto';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update.dto';
import { Company } from './entities/company.entity';
import { IndexCompanyDto } from './dto/index.dto';
import { ShowCompanyDto } from './dto/show.dto';

/**
 * Controller for managing company operations
 */
@ApiTags('Company') 
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  /**
   * Create a new company
   * @param createCompanyDto - The company data to create
   * @returns The created company
   */
  @Post("create")
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 200, description: 'Company successfully created', type: ShowCompanyDto ,isArray: false})
  @ApiConflictResponse({description: 'A company with this name already exists.'})
  @ApiBadRequestResponse({description: 'Invalid input data.'})
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<ResponseDto<Company>> {
    return this.companyService.create(createCompanyDto);
  }

  /**
   * Get all companies
   * @returns A list of companies
   */
  @Get('index')
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Get all companies with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Number of items per page' })
  @ApiResponse({status: 200,description: 'List of companies with pagination metadata', type: IndexCompanyDto })
  async findAll(
    @Query('page') page = 1, 
    @Query('limit') limit = 10
  ) : Promise<IndexCompanyDto<Company>> {
      return this.companyService.findAll(Number(page), Number(limit));
  }

  /**
   * Get a single company by ID
   * @param id - The ID of the company to retrieve
   * @returns The company data
   */
  @Get('show/:id')
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Get a company by ID' })
  @ApiResponse({ status: 200, description: 'Company data', type: ShowCompanyDto })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async findOne(@Param('id') id: string): Promise<ResponseDto<Company>> {
    return this.companyService.findOne(id);
  }

  /**
   * Update an existing company
   * @param id - The ID of the company to update
   * @param updateCompanyDto - The data to update
   * @returns The updated company
   */
  @Put('update/:id')
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Update a company by ID' })
  @ApiResponse({ status: 200, description: 'Company successfully updated', type: ShowCompanyDto })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<ResponseDto<Company>> {
    return this.companyService.update(id, updateCompanyDto);
  }

  /**
   * Delete a company
   * @param id - The ID of the company to delete
   * @returns A success message
   */
  @Delete('destroy/:id')
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Delete a company by ID' })
  @ApiResponse({ status: 200, description: 'Company successfully deleted' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async remove(@Param('id') id: string): Promise<any> {
    return this.companyService.remove(id);
  }
}