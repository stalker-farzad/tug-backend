import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for creating a product
 */
export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Smartphone',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'A detailed description of the product',
    example: 'A high-end smartphone with advanced features',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 999.99,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Unique barcode for the product',
    example: '1234567890123456',
  })
  @IsString()
  @IsNotEmpty()
  barcode: string;

  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 46,
  })
  @IsNumber()
  stockQuantity: number;

  @ApiProperty({
    description: 'The ID of the company that owns the product',
    type: String,
    required: true,
    example : "de5d80a7-c70b-4cc2-a6f0-b74e10ab8141"
  })
  @IsNotEmpty()
  @IsUUID() 
  companyId?: string;

  @ApiProperty({
    description: 'The ID of the category that the product belongs to',
    type: String,
    example:"de5d80a7-c70b-4cc2-a6f0-b74e10ab8141"
  })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    description: 'The ID of the optional subcategory that the product belongs to',
    type: String,
    required: false,
    default : null
  })
  @IsOptional()
  @IsUUID()
  subcategoryId?: string;
}