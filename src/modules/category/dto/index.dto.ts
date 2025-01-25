import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

class CategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty({ nullable: true })
  @Exclude()
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

export class IndexCategoryDto {
  @ApiProperty()
  succeed: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [CategoryDto] })
  result: CategoryDto[];

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}
