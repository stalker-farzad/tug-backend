import { ApiProperty } from '@nestjs/swagger';

class SubCategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  categoryId: string; 

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty({ nullable: true })
  deletedAt: string | null;
}

class MetaDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}

export class IndexSubCategoryDto {
  @ApiProperty()
  succeed: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [SubCategoryDto] })
  result: SubCategoryDto[];

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}
