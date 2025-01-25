import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';

export class PaginationMetaDto {
  @ApiProperty({ description: 'The total number of items' })
  total: number;

  @ApiProperty({ description: 'The current page number' })
  page: number;

  @ApiProperty({ description: 'The number of items per page' })
  limit: number;

  @ApiProperty({ description: 'The total number of pages' })
  totalPages: number;
}


export class IndexProducteDto<T>{
  @ApiProperty({ example: true, description: 'Indicates success or failure' })
  succeed: boolean;

  @ApiProperty({ example: 'Products fetched successfully', description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'The list of products', type: [Product] })
  result: Product[];

  @ApiProperty({ description: 'Pagination metadata', type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
