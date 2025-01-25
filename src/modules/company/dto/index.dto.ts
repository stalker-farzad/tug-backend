import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../entities/company.entity';

export class MetaDto {
    @ApiProperty({ example: 20, description: 'Total number of items' })
    total: number;

    @ApiProperty({ example: 1, description: 'Current page number' })
    page: number;

    @ApiProperty({ example: 10, description: 'Number of items per page' })
    limit: number;

    @ApiProperty({ example: 2, description: 'Total number of pages' })
    totalPages: number;
}

export class IndexCompanyDto<T> {
    @ApiProperty({ example: true, description: 'Indicates success or failure' })
    succeed: boolean;

    @ApiProperty({ example: 'Companies fetched successfully', description: 'Response message' })
    message: string;

    @ApiProperty( {type: [Company]})
    result: Company[];

    @ApiProperty({ description: 'Pagination metadata', type: MetaDto })
    meta: MetaDto;
}
