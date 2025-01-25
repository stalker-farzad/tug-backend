import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;
}

export class CategoryResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;
}

export class SubCategoryResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;
}

export class ProductShowResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  price: string;

  @ApiProperty()
  @Expose()
  barcode: string;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  companyId: string;

  @ApiProperty()
  @Expose()
  stockQuantity: number;

  @ApiProperty({ type: CompanyResponseDto, nullable: true })
  @Expose()
  @Type(() => CompanyResponseDto)
  company: CompanyResponseDto;

  @ApiProperty({ type: CategoryResponseDto, nullable: true })
  @Expose()
  @Type(() => CategoryResponseDto)
  category: CategoryResponseDto;

  @ApiProperty({ nullable: true })
  @Expose()
  @Type(() => SubCategoryResponseDto)
  subcategory: SubCategoryResponseDto;

  // Custom getter to populate subcategory or return null
  @Expose()
  getSubcategory() {
    return this.subcategory ? this.subcategory : null;
  }
}

export class ShowProductDto{
    @ApiProperty({ example: true, description: 'Indicates success or failure' })
    succeed: boolean;

    @ApiProperty({ example: 'Products fetched successfully', description: 'Response message' })
    message: string;

    @ApiProperty( {type: ProductShowResponseDto})
    result: ProductShowResponseDto;
}
